const router = require('express').Router();
const messageController = require('../controllers/messageController');
const verifyToken = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', messageController.sendMessage);
router.get('/conversations', messageController.getConversations);
router.get('/:otherUserId/:adId', messageController.getMessages);

module.exports = router;
