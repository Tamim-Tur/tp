const { User, Ad, Transaction } = require('../models');

// Get user's purchases (transactions where user is buyer)
exports.getMyPurchases = async (req, res) => {
    try {
        const purchases = await Transaction.findAll({
            where: { buyerId: req.user.userId },
            include: [
                {
                    model: Ad,
                    as: 'ad',
                    include: [{ model: User, as: 'seller', attributes: ['username', 'email'] }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(purchases);
    } catch (error) {
        console.error('Error fetching purchases:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user's sales (ads created by user)
exports.getMySales = async (req, res) => {
    try {
        const sales = await Ad.findAll({
            where: { userId: req.user.userId },
            include: [
                {
                    model: Transaction,
                    required: false,
                    include: [{ model: User, as: 'buyer', attributes: ['username', 'email'] }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(sales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: ['uuid', 'username', 'email', 'role', 'createdAt']
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
