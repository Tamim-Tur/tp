const router = require('express').Router();
const adController = require('../controllers/adController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', adController.getAllAds);
router.get('/:uuid', adController.getAdById);
router.post('/', verifyToken, upload.single('image'), adController.createAd);
router.patch('/:uuid/sold', verifyToken, adController.markAsSold);
router.put('/:uuid', verifyToken, upload.single('image'), adController.updateAd);
router.delete('/:uuid', verifyToken, adController.deleteAd);

module.exports = router;
