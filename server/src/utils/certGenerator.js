const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');

const certPath = path.join(__dirname, '../../certs');
const keyFile = path.join(certPath, 'server.key');
const certFile = path.join(certPath, 'server.cert');

async function generateCertificates() {
  if (!fs.existsSync(certPath)) {
    fs.mkdirSync(certPath, { recursive: true });
  }

  if (fs.existsSync(keyFile) && fs.existsSync(certFile)) {
    console.log('Certificates already exist. Skipping generation.');
    return {
      key: fs.readFileSync(keyFile),
      cert: fs.readFileSync(certFile)
    };
  }

  console.log('Generating self-signed certificates...');
  const attrs = [{ name: 'commonName', value: 'localhost' }];

  // selfsigned v5 might return a promise or object, let's handle both
  const pems = await selfsigned.generate(attrs, { days: 365 });

  fs.writeFileSync(keyFile, pems.private);
  fs.writeFileSync(certFile, pems.cert);

  console.log('Certificates generated successfully.');
  return {
    key: pems.private,
    cert: pems.cert
  };
}

module.exports = generateCertificates;
