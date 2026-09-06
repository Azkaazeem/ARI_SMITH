import express from 'express';
import { BookingService, SettingsService } from '../models/index.js';
import { sendBookingNotification } from '../config/mailer.js';

const router = express.Router();

// Helper to calculate indicative quote based on format and guest count
function calculateIndicativeQuote(eventType, guestCount) {
  let base = 2500;
  if (eventType.includes('Stage') || eventType.includes('Grand')) {
    base = 8500;
    if (guestCount > 200) base += 2500;
  } else if (eventType.includes('Mind Reading') || eventType.includes('Mentalism')) {
    base = 4500;
    if (guestCount > 100) base += 1500;
  } else if (eventType.includes('Close-Up') || eventType.includes('Sleight')) {
    base = 2800;
    if (guestCount > 150) base += 1200;
  }
  return `£${base.toLocaleString('en-GB')}`;
}

// GET /api/availability?month=YYYY-MM
router.get('/availability', async (req, res) => {
  try {
    const { month } = req.query; // format: YYYY-MM
    const settings = await SettingsService.getSettings();
    const blockedDates = settings.blockedDates || [];

    const bookings = await BookingService.find();
    // Confirmed bookings also block the date
    const bookedDates = bookings
      .filter(b => b.status === 'confirmed')
      .map(b => b.eventDate);

    // Combine and deduplicate
    const unavailableDates = Array.from(new Set([...blockedDates, ...bookedDates]));

    // Filter by month if query provided
    const filtered = month
      ? unavailableDates.filter(d => d.startsWith(month))
      : unavailableDates;

    return res.json({
      success: true,
      month: month || 'all',
      unavailableDates: filtered,
      notice: settings.activeNotice
    });
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ success: false, message: 'Could not fetch calendar availability.' });
  }
});

// POST /api/bookings
router.post('/bookings', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      eventType, 
      eventDate, 
      venueCity, 
      guestCount, 
      budgetRange,
      specialRequests 
    } = req.body;

    if (!name || !email || !eventType || !eventDate || !venueCity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing mandatory fields (Name, Email, Event Type, Date, Venue City).' 
      });
    }

    // Check date availability
    const settings = await SettingsService.getSettings();
    const isBlocked = (settings.blockedDates || []).includes(eventDate);
    const existingBookings = await BookingService.find({ eventDate });
    const isBooked = existingBookings.some(b => b.status === 'confirmed');

    if (isBlocked || isBooked) {
      return res.status(409).json({
        success: false,
        message: `The date ${eventDate} is already sealed by mystery (booked or privately reserved). Please select an alternative date or consult Ari's concierge directly.`
      });
    }

    const priceQuote = calculateIndicativeQuote(eventType, Number(guestCount) || 50);

    const newBooking = await BookingService.create({
      name,
      email,
      phone: phone || 'Not provided',
      eventType,
      eventDate,
      venueCity,
      guestCount: Number(guestCount) || 50,
      budgetRange: budgetRange || 'Bespoke',
      priceQuote,
      specialRequests: specialRequests || '',
      status: 'pending'
    });

    // Send notifications (async, doesn't block response)
    sendBookingNotification(newBooking).catch(e => console.warn(e));

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been telepathically sealed. Ari Smith\'s concierge will reply within 24 hours.',
      booking: newBooking
    });
  } catch (err) {
    console.error('Error saving booking:', err);
    res.status(500).json({ success: false, message: 'Server error processing booking inquiry.' });
  }
});

export default router;
