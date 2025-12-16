const { Message, User, Ad } = require('../models');
const { z } = require('zod');
const { Op } = require('sequelize');

const messageSchema = z.object({
    adId: z.string().uuid(),
    content: z.string().min(1).max(2000),
    receiverId: z.string().uuid()
});

exports.sendMessage = async (req, res) => {
    try {
        console.log('sendMessage called. Body:', req.body);
        console.log('User:', req.user);

        const { adId, content, receiverId } = messageSchema.parse(req.body);

        if (req.user.userId === receiverId) {
            return res.status(400).json({ message: 'You cannot message yourself' });
        }

        // Verify Ad exists
        const ad = await Ad.findByPk(adId);
        if (!ad) return res.status(404).json({ message: 'Ad not found' });

        const message = await Message.create({
            senderId: req.user.userId,
            receiverId,
            adId,
            content
        });

        console.log('Message created:', message.uuid);
        res.status(201).json(message);
    } catch (error) {
        if (error.issues) {
            console.log('Zod validation error:', error.issues);
            return res.status(400).json({ errors: error.issues });
        }
        console.error('Send message error details:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find all messages where user is sender or receiver
        // This is a bit complex in Sequelize to group efficiently without raw queries, 
        // so we'll fetch distinct pairs.
        // Simplified: Fetch all messages involving the user, order by date, then group in memory.

        const messages = await Message.findAll({
            where: {
                [Op.or]: [{ senderId: userId }, { receiverId: userId }]
            },
            include: [
                { model: User, as: 'sender', attributes: ['uuid', 'username'] },
                { model: User, as: 'receiver', attributes: ['uuid', 'username'] },
                { model: Ad, as: 'ad', attributes: ['uuid', 'title'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Group by Conversation Key: AdId + OtherUserId
        const conversations = {};

        messages.forEach(msg => {
            const isSender = msg.senderId === userId;
            const otherUser = isSender ? msg.receiver : msg.sender;
            const adId = msg.adId;

            if (!otherUser || !msg.ad) return; // Skip if data missing

            const key = `${adId}-${otherUser.uuid}`;

            if (!conversations[key]) {
                conversations[key] = {
                    ad: msg.ad,
                    otherUser: otherUser,
                    lastMessage: msg
                };
            }
        });

        res.json(Object.values(conversations));
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { otherUserId, adId } = req.params;

        const messages = await Message.findAll({
            where: {
                adId,
                [Op.or]: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId }
                ]
            },
            include: [
                { model: User, as: 'sender', attributes: ['uuid', 'username'] }
            ],
            order: [['createdAt', 'ASC']]
        });

        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Message.count({
            where: {
                receiverId: req.user.userId,
                isRead: false
            }
        });
        res.json({ count });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { adId, senderId } = req.body;

        await Message.update({ isRead: true }, {
            where: {
                receiverId: req.user.userId,
                senderId: senderId,
                adId: adId,
                isRead: false
            }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
