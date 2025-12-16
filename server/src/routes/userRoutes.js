const router = require('express').Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/profile', verifyToken, userController.getProfile);
router.get('/purchases', verifyToken, userController.getMyPurchases);
router.get('/sales', verifyToken, userController.getMySales);

module.exports = router;
