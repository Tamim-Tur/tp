const https = require('https');
const fs = require('fs');
const path = require('path');
const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// HTTPS Configuration with auto-generated self-signed certificates for development
const { execSync } = require('child_process');
const certsDir = path.join(__dirname, '../certs');

if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
}

const keyPath = path.join(certsDir, 'server-key.pem');
const certPath = path.join(certsDir, 'server-cert.pem');

(async () => {
    try {
        if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
            console.log('Generating self-signed SSL certificates...');
            const selfsigned = require('selfsigned');
            const attrs = [{ name: 'commonName', value: 'localhost' }];
            const pems = await selfsigned.generate(attrs, { days: 365 });

            fs.writeFileSync(keyPath, pems.private);
            fs.writeFileSync(certPath, pems.cert);
        }

        const options = {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)
        };

        const server = https.createServer(options, app);

        server.listen(PORT, () => {
            console.log(`Secure HTTPS Server running on https://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
})();
