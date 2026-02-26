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

// Body parser
// Note: Webhook endpoint might need raw body, we'll handle this in the routes layer
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Apply Rate Limiting to all requests
app.use(apiLimiter);

// Mount routes
app.use('/api', indexRoutes);

// Base route for health check
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running normally.' });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
