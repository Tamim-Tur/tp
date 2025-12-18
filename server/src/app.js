const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const setupSecurity = require('./middleware/securityMiddleware');
const authRoutes = require('./routes/authRoutes');
const adRoutes = require('./routes/adRoutes');
const { sequelize } = require('./models');
const AuditLog = require('./models/mongo/AuditLog');
const path = require('path');

// Connect to MongoDB for Audit Logging
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shop-audit')
    .then(() => console.log('✅ Connected to MongoDB for Audit Logs'))
    .catch(err => console.error('MongoDB Connection Error:', err));

const app = express();

// Middleware
setupSecurity(app);
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static(path.join(__dirname, '../../images')));

// Audit Logging Middleware
app.use(async (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        // Log asynchronously
        AuditLog.create({
            method: req.method,
            path: req.path,
            ip: req.ip,
            statusCode: res.statusCode,
            duration,
            userId: req.user?.userId || null,
            userAgent: req.get('user-agent')
        }).catch(err => console.error('Audit Log Error:', err));
    });
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// Handle 404 errors with JSON
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    // Force generic error message to prevent PII/Info Disclosure in ZAP scans
    res.status(err.status || 500).json({
        message: 'Internal Server Error'
    });
});

// Database sync
sequelize.sync({ alter: true }).then(async () => {
    console.log('Database synced');
    const seedData = require('./seed');
    // Only run seed in dev/test environment
    if (process.env.NODE_ENV !== 'production') {
        await seedData();
    }
});

module.exports = app;
