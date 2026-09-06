import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialReviews, initialBookings, initialSettings } from '../data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/store.json');

let isConnectedToMongo = false;

// In-Memory / File Persistent Store
class JsonStore {
  constructor() {
    this.data = {
      reviews: [...initialReviews],
      bookings: [...initialBookings],
      settings: { ...initialSettings }
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          reviews: parsed.reviews && parsed.reviews.length ? parsed.reviews : [...initialReviews],
          bookings: parsed.bookings || [...initialBookings],
          settings: parsed.settings || { ...initialSettings }
        };
      } else {
        this.save();
      }
    } catch (err) {
      console.warn('Could not read store.json, using memory default:', err.message);
    }
  }

  save() {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not save store.json:', err.message);
    }
  }
}

export const localStore = new JsonStore();

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ari_smith_db';
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500
    });
    isConnectedToMongo = true;
    console.log(`[Database] Connected to live MongoDB: ${mongoUri}`);
    await syncMongoData();
  } catch (err) {
    isConnectedToMongo = false;
    console.log(`[Database] MongoDB fallback active (${err.message}).`);
  }
}

export function isMongoActive() {
  return isConnectedToMongo;
}

async function syncMongoData() {
  try {
    const { ReviewModel, BookingModel, SettingsModel } = await import('../models/index.js');
    
    // Always ensure authentic Google reviews from arismith.co.uk are present
    const reviewCount = await ReviewModel.countDocuments();
    if (reviewCount === 0) {
      await ReviewModel.insertMany(initialReviews);
      console.log('[Database] Seeded authentic Google reviews in MongoDB.');
    } else {
      // If previous fictional seed exists, replace with real Google reviews
      const sample = await ReviewModel.findOne();
      if (sample && (sample.clientName === 'Sir Alistair Vance' || sample.clientName === 'Elena Rostova')) {
        await ReviewModel.deleteMany({});
        await ReviewModel.insertMany(initialReviews);
        console.log('[Database] Updated MongoDB reviews to real Google reviews from arismith.co.uk.');
      }
    }

    const settings = await SettingsModel.findOne();
    if (!settings) {
      await SettingsModel.create(initialSettings);
      console.log('[Database] Seeded initial settings in MongoDB.');
    }
  } catch (err) {
    console.warn('[Database] Syncing MongoDB warning:', err.message);
  }
}
