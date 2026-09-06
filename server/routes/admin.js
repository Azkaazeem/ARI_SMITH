import express from 'express';
import jwt from 'jsonwebtoken';
import { BookingService, SettingsService } from '../models/index.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ari_smith_occult_sanctum_key_2026';

// Middleware for protected routes
export function verifyAdminToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Sanctum access key required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminUser = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired sanctum key.' });
  }
}

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const settings = await SettingsService.getSettings();

    // Default admin: username 'ari@smith-illusion.co.uk' or 'ari', password 'theillusionist'
    const validUser = settings.adminUser || 'ari@smith-illusion.co.uk';
    const validPass = settings.adminPasswordHash || 'theillusionist';

    const isMatch = (username === validUser || username === 'ari') && password === validPass;

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Forbidden: Incorrect mystic phrase or email.' });
    }

    const token = jwt.sign(
      { user: validUser, role: 'grandmaster' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      admin: { email: validUser, role: 'Ari Smith Master Access' }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Authentication failed.' });
  }
});

// GET /api/admin/bookings (Protected)
router.get('/bookings', verifyAdminToken, async (req, res) => {
  try {
    const bookings = await BookingService.find();
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving bookings.' });
  }
});

// PATCH /api/admin/bookings/:id (Protected)
router.patch('/bookings/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priceQuote, specialRequests } = req.body;

    const updated = await BookingService.findByIdAndUpdate(id, {
      ...(status && { status }),
      ...(priceQuote && { priceQuote }),
      ...(specialRequests && { specialRequests })
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    res.json({ success: true, booking: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating booking.' });
  }
});

// GET /api/admin/settings (Protected)
router.get('/settings', verifyAdminToken, async (req, res) => {
  try {
    const settings = await SettingsService.getSettings();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching settings.' });
  }
});

// PATCH /api/admin/settings (Protected)
router.patch('/settings', verifyAdminToken, async (req, res) => {
  try {
    const { blockedDates, activeNotice, defaultTheme } = req.body;
    const updated = await SettingsService.updateSettings({
      ...(blockedDates && { blockedDates }),
      ...(activeNotice !== undefined && { activeNotice }),
      ...(defaultTheme && { defaultTheme })
    });
    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating settings.' });
  }
});

export default router;
