const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const setupSecurity = (app) => {
    // Baseline security headers
    app.use(helmet());

    // Explicit HSTS (HTTPS only) — 6 months
    // Note: enable only when running behind HTTPS (we are using https.createServer)
    app.use(helmet.hsts({
        maxAge: 15552000, // 180 days in seconds
        includeSubDomains: true,
        preload: true
    }));

    // CORS Configuration
    const corsOptions = {
        origin: process.env.FRONTEND_URL || 'https://localhost:5173',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    };
    app.use(cors(corsOptions));

    // Rate Limiting to prevent Brute Force
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        message: 'Too many requests from this IP, please try again later',
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(limiter);
};

module.exports = setupSecurity;
