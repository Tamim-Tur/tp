const router = require('express').Router();
const adController = require('../controllers/adController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', adController.getAllAds);
router.get('/:uuid', adController.getAdById);
router.post('/', verifyToken, adController.createAd);

module.exports = router;
