const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const setupSecurity = require('./middleware/securityMiddleware');
const authRoutes = require('./routes/authRoutes');
const adRoutes = require('./routes/adRoutes');
const { sequelize } = require('./models');
const connectMongo = require('./config/mongo');
const AuditLog = require('./models/mongo/AuditLog');

const app = express();

// Connect to MongoDB
connectMongo();

// Middleware
setupSecurity(app); // Helmet, CORS, Rate Limit
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use('/images', express.static(require('path').join(__dirname, '../../images'))); // Serve default images from project root
// app.use(morgan('dev'));

// Simple Audit Middleware (logs to Mongo if available)
app.use(async (req, res, next) => {
    if (mongoose.connection.readyState === 1) { // 1 = connected
        try {
            res.on('finish', () => {
                AuditLog.create({
                    method: req.method,
                    path: req.path,
                    ip: req.ip,
                    userId: req.user?.userId || 'anonymous',
                    action: 'request',
                    severity: res.statusCode >= 400 ? 'warning' : 'info'
                }).catch(err => console.error('Audit Log Error', err));
            });
        } catch (e) { console.error(e); }
    }
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Database sync
sequelize.sync({ alter: true }).then(async () => {
    console.log('Database synced');
    const seedData = require('./seed');
    await seedData();
});

module.exports = app;
