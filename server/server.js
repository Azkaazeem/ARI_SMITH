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

// Secure CORS Origin Whitelist:
// Allows localhost development and any authentic .vercel.app / .vercel.com deployment
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // allow server-to-server, curl, Postman, mobile webview, health probes

  // 1. Localhost development (localhost / 127.0.0.1 on any port)
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return true;
  }

  // 2. Any authentic .vercel.app or .vercel.com deployment (HTTPS required, strict boundary)
  if (/^https:\/\/([a-zA-Z0-9-]+\.)*vercel\.(app|com)$/.test(origin)) {
    return true;
  }

  // 3. Optional custom client domain configured in environment
  if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
    return true;
  }

  return false;
};

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`[Security Sanctum] CORS blocked: Origin '${origin}' is not permitted.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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

if (!process.env.VERCEL) {
  start();
}

export default app;
