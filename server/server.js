import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import bookingRoutes from './routes/bookings.js';
import reviewRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', bookingRoutes);
app.use('/api', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Ari Smith Illusionist Sanctum Backend' 
  });
});

// Start server
async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[Sanctum Server] Arcane gateway open at http://localhost:${PORT}`);
    console.log(`[Endpoints] Ready for bookings, streaming AI telepathy, and admin sanctuary.`);
  });
}

start();
