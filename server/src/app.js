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
// NOTE SÉCURITÉ: éviter d'exposer /uploads en statique en prod.
// Servir via un contrôleur qui ajoute Content-Disposition: attachment
// et qui vérifie l'autorisation d'accès si nécessaire.
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
app.use('/api/user', require('./routes/userRoutes'));

// Database sync
// VULNÉRABILITÉ (démo): alter le schéma en run-time peut casser la prod.
// Utiliser des migrations (Sequelize-CLI/Umzug) et désactiver en prod.
sequelize.sync({ alter: true }).then(async () => {
    console.log('Database synced');
    // VULNÉRABILITÉ (démo): lancer le seed par défaut crée des comptes connus (ex: admin/mdp faible).
    // Protéger par une variable d'environnement et ne JAMAIS activer en production.
    // if (process.env.SEED === 'true' && process.env.NODE_ENV !== 'production') {
    //   const seedData = require('./seed');
    //   await seedData();
    // }
    const seedData = require('./seed'); // démo active
    await seedData(); // démo: laissé actif pour montrer la faille
});

module.exports = app;
