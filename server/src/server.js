const https = require('https');
const fs = require('fs');
const path = require('path');
const app = require('./app');
const generateCertificates = require('./utils/certGenerator');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Generate or load certificates
const startServer = async () => {
    try {
        const { key, cert } = await generateCertificates();
        const server = https.createServer({ key, cert }, app);

        server.listen(PORT, () => {
            console.log(`Secure Server running on https://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
