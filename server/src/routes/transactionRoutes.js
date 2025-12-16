const express = require('express');
const transactionController = require('../controllers/transactionController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

router.post('/purchase', transactionController.purchaseAd);
router.get('/purchases', transactionController.getMyPurchases);
router.get('/sales', transactionController.getMySales);

module.exports = router;
