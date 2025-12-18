const router = require('express').Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');
// Exemple (commenté) de rate-limit spécifique au login (à importer depuis securityMiddleware ou à créer ici)
// const rateLimit = require('express-rate-limit');
// const loginLimiter = rateLimit({ windowMs: 10*60*1000, max: 5, standardHeaders: true });

router.post('/register', authController.register);
// router.post('/login', loginLimiter, authController.login); // version sécurisée
router.post('/login', authController.login); // démo: sans limite dédiée
router.post('/logout', authController.logout);
router.get('/me', verifyToken, authController.me);

module.exports = router;
