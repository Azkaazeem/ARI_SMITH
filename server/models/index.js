import mongoose from 'mongoose';
import { isMongoActive, localStore } from '../config/db.js';

// Mongoose Schemas
const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventType: { type: String, required: true },
  eventDate: { type: String, required: true },
  venueCity: { type: String, required: true },
  guestCount: { type: Number, required: true },
  budgetRange: { type: String, default: '£2,500 - £5,000' },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'declined'], 
    default: 'pending' 
  },
  priceQuote: { type: String, default: 'Pending Custom Consultation' },
  specialRequests: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const ReviewSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  eventCategory: { type: String, required: true },
  quote: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  verifiedBadge: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const SettingsSchema = new mongoose.Schema({
  activeNotice: { type: String, default: '' },
  blockedDates: [{ type: String }],
  defaultTheme: { type: String, default: 'abyssal' },
  contactEmail: { type: String, default: 'concierge@arismithmagic.com' },
  adminUser: { type: String, default: 'ari@smith-illusion.co.uk' },
  adminPasswordHash: { type: String, default: 'theillusionist' }
});

export const BookingModel = mongoose.model('Booking', BookingSchema);
export const ReviewModel = mongoose.model('Review', ReviewSchema);
export const SettingsModel = mongoose.model('Settings', SettingsSchema);

// Unified Service Layer
export const BookingService = {
  async find(filter = {}) {
    if (isMongoActive()) {
      return await BookingModel.find(filter).sort({ createdAt: -1 });
    }
    let list = [...localStore.data.bookings];
    if (filter.eventDate) {
      list = list.filter(b => b.eventDate === filter.eventDate);
    }
    if (filter.status) {
      list = list.filter(b => b.status === filter.status);
    }
    return list;
  },

  async findById(id) {
    if (isMongoActive()) {
      return await BookingModel.findById(id);
    }
    return localStore.data.bookings.find(b => (b._id || b.id) === id || b.id === id);
  },

  async create(data) {
    if (isMongoActive()) {
      return await BookingModel.create(data);
    }
    const newBooking = {
      _id: 'bk_' + Date.now() + Math.random().toString(36).substr(2, 4),
      id: 'bk_' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...data
    };
    localStore.data.bookings.unshift(newBooking);
    localStore.save();
    return newBooking;
  },

  async findByIdAndUpdate(id, updates) {
    if (isMongoActive()) {
      return await BookingModel.findByIdAndUpdate(id, updates, { new: true });
    }
    const idx = localStore.data.bookings.findIndex(b => (b._id || b.id) === id);
    if (idx !== -1) {
      localStore.data.bookings[idx] = { ...localStore.data.bookings[idx], ...updates };
      localStore.save();
      return localStore.data.bookings[idx];
    }
    return null;
  }
};

export const ReviewService = {
  async find() {
    if (isMongoActive()) {
      return await ReviewModel.find().sort({ createdAt: -1 });
    }
    return localStore.data.reviews;
  },

  async create(data) {
    if (isMongoActive()) {
      return await ReviewModel.create(data);
    }
    const newRev = {
      _id: 'rev_' + Date.now(),
      createdAt: new Date().toISOString(),
      verifiedBadge: true,
      rating: 5,
      ...data
    };
    localStore.data.reviews.unshift(newRev);
    localStore.save();
    return newRev;
  }
};

export const SettingsService = {
  async getSettings() {
    if (isMongoActive()) {
      let s = await SettingsModel.findOne();
      if (!s) {
        s = await SettingsModel.create(localStore.data.settings);
      }
      return s;
    }
    return localStore.data.settings;
  },

  async updateSettings(updates) {
    if (isMongoActive()) {
      return await SettingsModel.findOneAndUpdate({}, updates, { new: true, upsert: true });
    }
    localStore.data.settings = { ...localStore.data.settings, ...updates };
    localStore.save();
    return localStore.data.settings;
  }
};
