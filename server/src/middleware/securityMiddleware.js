const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const setupSecurity = (app) => {
    // Baseline security headers (sans HSTS pour HTTP)
    app.use(helmet());

    // VULNÉRABILITÉ (démo): Pas de HSTS avec HTTP
    // Le navigateur ne forcera pas HTTPS
    // app.use(helmet.hsts({ ... })); // RETIRÉ

    // CORS Configuration pour HTTP
    const corsOptions = {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173', // HTTP au lieu de HTTPS
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    };
    app.use(cors(corsOptions));

    // VULNÉRABILITÉ (démo): CORS permissif avec credentials
    // Combiné avec HTTP, facilite les attaques CSRF et interception

    // Rate Limiting to prevent Brute Force
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        message: 'Too many requests from this IP, please try again later',
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(limiter);

    // NOTE: Rate limiting seul n'est pas suffisant contre les attaques sophistiquées
};

module.exports = setupSecurity;
