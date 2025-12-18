// VULNÉRABILITÉ (démo): Serveur HTTP au lieu de HTTPS
// Les données transitent en clair sur le réseau (pas de chiffrement TLS)
// Un attaquant peut intercepter les mots de passe, tokens, données sensibles
const http = require('http');
const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`⚠️  UNSECURE Server running on http://localhost:${PORT}`);
    console.log('WARNING: No SSL/TLS encryption - data transmitted in plain text!');
});
