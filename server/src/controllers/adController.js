const { Ad, User } = require('../models');
const { adSchema } = require('../utils/validation');

exports.createAd = async (req, res) => {
    try {
        // Parse price to number since FormData sends everything as strings
        const dataToValidate = {
            ...req.body,
            price: parseFloat(req.body.price)
        };

        const validatedData = adSchema.parse(dataToValidate);

        // Handle image: either from file upload or URL
        let imageUrl = validatedData.imageUrl || '';

        if (req.file) {
            // If file was uploaded, use the file path
            imageUrl = `/uploads/${req.file.filename}`;
        } else if (imageUrl === '') {
            // Convert empty string to null to avoid Sequelize validation error
            imageUrl = null;
        }

        const ad = await Ad.create({
            ...validatedData,
            imageUrl,
            userId: req.user.userId
        });

        res.status(201).json(ad);
    } catch (error) {
        if (error.issues) {
            return res.status(400).json({ errors: error.issues });
        }
        console.error('Error creating ad:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllAds = async (req, res) => {
    try {
        const ads = await Ad.findAll({
            where: { status: 'available' },
            include: [{ model: User, as: 'seller', attributes: ['username'] }]
        });
        res.json(ads);
    } catch (error) {
        console.error('Error in getAllAds:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
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
