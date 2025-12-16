const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const setupSecurity = (app) => {
    app.use(helmet());

    // CORS Configuration
    const corsOptions = {
        origin: process.env.FRONTEND_URL || 'https://localhost:5173',
        credentials: true,
        optionsSuccessStatus: 200
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
