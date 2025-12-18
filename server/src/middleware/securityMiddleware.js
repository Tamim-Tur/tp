const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const setupSecurity = (app) => {
    // Baseline security headers
    app.use(helmet());
    app.use(helmet.hsts({
        maxAge: 15552000, // 180 days in seconds
        includeSubDomains: true,
        preload: true
    }));

    // RENFORCEMENT RECOMMANDÉ (commenté): ajouter une CSP stricte adaptée au front
    // app.use(helmet.contentSecurityPolicy({
    //     useDefaults: true,
    //     directives: {
    //         "default-src": ["'self'"],
    //         "img-src": ["'self'", "data:", process.env.FRONTEND_URL || 'https://localhost:5173'],
    //         "connect-src": ["'self'", process.env.FRONTEND_URL || 'https://localhost:5173'],
    //     },
    // }));

    // CORS Configuration
    const corsOptions = {
        origin: process.env.FRONTEND_URL || 'https://localhost:5173',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    };
    app.use(cors(corsOptions));

    // VIGILANCE: si FRONTEND_URL est mal configurée (ou trop permissive),
    // combiner credentials: true et SameSite=None peut exposer les cookies aux sites tiers.
    // Utiliser une whitelist stricte d'origines en prod.

    // Rate Limiting to prevent Brute Force
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        message: 'Too many requests from this IP, please try again later',
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(limiter);

    // LIMITER SPÉCIFIQUE LOGIN (exemple commenté): à appliquer seulement sur /api/auth/login
    // const loginLimiter = rateLimit({
    //   windowMs: 10 * 60 * 1000,
    //   max: 5,
    //   message: 'Too many login attempts, please try again later.'
    // });
    // Exporter/attacher loginLimiter puis l'utiliser dans authRoutes sur POST /login
};

module.exports = setupSecurity;
