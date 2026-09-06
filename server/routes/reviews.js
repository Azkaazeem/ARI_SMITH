import express from 'express';
import { ReviewService } from '../models/index.js';

const router = express.Router();

// GET /api/reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await ReviewService.find();
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ success: false, message: 'Could not retrieve reviews.' });
  }
});

// POST /api/reviews
router.post('/reviews', async (req, res) => {
  try {
    const { clientName, eventCategory, quote, rating } = req.body;
    if (!clientName || !quote) {
      return res.status(400).json({ success: false, message: 'Name and testimonial quote are required.' });
    }
    const newRev = await ReviewService.create({
      clientName,
      eventCategory: eventCategory || 'Private Engagement',
      quote,
      rating: Number(rating) || 5,
      verifiedBadge: true
    });
    res.status(201).json({ success: true, review: newRev });
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ success: false, message: 'Could not create review.' });
  }
});

export default router;
