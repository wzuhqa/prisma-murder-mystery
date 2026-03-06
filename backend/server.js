require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { apiLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/db');

// Import Routes
const indexRoutes = require('./routes/index');

const app = express();

// Connect to database
connectDB();

// ─── Webhook raw-body parsing (MUST come before express.json) ─────────────────
// Easebuzz webhooks need the raw request body to compute the HMAC digest.
// We selectively apply express.raw() ONLY on the webhook path.
app.use('/api/orders/webhook', express.raw({ type: 'application/json' }));

// ─── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. Postman, curl) in dev
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin ${origin} not allowed`));
        }
    },
    credentials: true
}));

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
app.use(apiLimiter);

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api', indexRoutes);

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running normally.',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

// ─── Centralized Error Handler (must be last) ──────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
