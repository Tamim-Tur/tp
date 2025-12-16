const { Ad, User } = require('../models');
const { adSchema } = require('../utils/validation');

exports.createAd = async (req, res) => {
    try {
        const validatedData = adSchema.parse(req.body);

        const ad = await Ad.create({
            ...validatedData,
            userId: req.user.userId
        });

        res.status(201).json(ad);
    } catch (error) {
        if (error.issues) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllAds = async (req, res) => {
    try {
        const ads = await Ad.findAll({
            include: [{ model: User, as: 'seller', attributes: ['username'] }]
        });
        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAdById = async (req, res) => {
    try {
        const ad = await Ad.findByPk(req.params.uuid, {
            include: [{ model: User, as: 'seller', attributes: ['username'] }]
        });
        if (!ad) return res.status(404).json({ message: 'Ad not found' });
        res.json(ad);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
