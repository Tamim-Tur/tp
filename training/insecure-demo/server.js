// WARNING: INTENTIONALLY INSECURE DEMO. DO NOT USE IN PRODUCTION.
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());

// CORS: wildcard + credentials (bad)
app.use(cors({ origin: '*', credentials: true }));

// Leaks X-Powered-By header by default (no helmet)

// Reflective XSS: injects `name` into HTML without encoding
app.get('/', (req, res) => {
  const name = req.query.name || 'World';
  res.set('Content-Type', 'text/html');
  res.send(`<h1>Welcome ${name}</h1>`);
});

// Weak auth: stores plain token in cookie without flags
app.post('/login', (req, res) => {
  const { email, password } = req.body; // no validation
  if (!email || !password) return res.status(400).json({ message: 'missing' });
  // Simulate login with hardcoded token
  const token = `user:${email}`; // not signed
  res.cookie('token', token, { httpOnly: false, secure: false, sameSite: 'lax' });
  res.json({ ok: true });
});

// Broken access control: no auth check but returns admin data if query matches
app.get('/admin', (req, res) => {
  if (req.query.user === 'admin') {
    return res.json({ secret: 'TOP-SECRET-ADMIN-DATA' });
  }
  res.status(403).json({ message: 'forbidden' });
});

// SQLi pattern (string concatenation). Not executed, but illustrative for scanners.
app.get('/user', (req, res) => {
  const email = req.query.email || '';
  const sql = "SELECT * FROM Users WHERE email = '" + email + "'";
  res.json({ debugQuery: sql });
});

// Command/code injection via eval
app.get('/exec', (req, res) => {
  try {
    if (req.query.code) {
      // extremely dangerous
      const output = eval(req.query.code);
      return res.json({ output });
    }
    res.json({ message: 'pass code param' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CSRFable state change endpoint (no auth, no CSRF)
app.post('/transfer', (req, res) => {
  const { to, amount } = req.body;
  // no validation, no auth
  res.json({ status: 'transferred', to, amount });
});

// Start HTTP (not HTTPS)
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`INSECURE demo running on http://localhost:${PORT}`));
