const { Ad, User } = require('../models');
const { adSchema } = require('../utils/validation'); // ✅ Validation réactivée
const xss = require('xss'); // Pour sanitization supplémentaire

exports.createAd = async (req, res) => {
    try {

        let imageUrl = req.body.imageUrl || '';

        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        } else if (imageUrl === '') {
            imageUrl = null;
        }

        // Validate and sanitize ad data
        const dataToValidate = {
            ...req.body,
            price: parseFloat(req.body.price) // Assure que c'est un nombre
        };

        const validatedData = adSchema.parse(dataToValidate);

        // Sanitization supplémentaire contre XSS stocké
        validatedData.title = xss(validatedData.title);
        validatedData.description = xss(validatedData.description);

        const ad = await Ad.create({
            title: validatedData.title,
            description: validatedData.description,
            price: validatedData.price,
            imageUrl,
            userId: req.user.userId
        });

        res.status(201).json(ad);
    } catch (error) {
        console.error('Error creating ad:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllAds = async (req, res) => {
    try {
        const ads = await Ad.findAll({
            include: [{ model: User, as: 'seller', attributes: ['uuid', 'username'] }],
            order: [['createdAt', 'DESC']]
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
            include: [{ model: User, as: 'seller', attributes: ['uuid', 'username'] }]
        });
        if (!ad) return res.status(404).json({ message: 'Ad not found' });
        res.json(ad);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateAd = async (req, res) => {
    try {
        const ad = await Ad.findByPk(req.params.uuid);

        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        // Check if user owns this ad
        if (ad.userId !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized: You can only edit your own ads' });
        }



        let imageUrl = ad.imageUrl;

        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        } else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl;
        }

        // Validate partial update
        const dataToValidate = {
            ...req.body,
            price: req.body.price ? parseFloat(req.body.price) : undefined
        };

        const validatedData = adSchema.partial().parse(dataToValidate);

        if (validatedData.title) validatedData.title = xss(validatedData.title);
        if (validatedData.description) validatedData.description = xss(validatedData.description);

        await ad.update({
            ...validatedData,
            imageUrl
        });

        res.json(ad);
    } catch (error) {
        console.error('Error updating ad:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteAd = async (req, res) => {
    try {
        const ad = await Ad.findByPk(req.params.uuid);

        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        // Check if user owns this ad
        if (ad.userId !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own ads' });
        }

        await ad.destroy();
        res.json({ message: 'Ad deleted successfully' });
    } catch (error) {
        console.error('Error deleting ad:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.markAsSold = async (req, res) => {
    try {
        const ad = await Ad.findByPk(req.params.uuid);

        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        // Check if user owns this ad
        if (ad.userId !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized: You can only update your own ads' });
        }

        await ad.update({ status: 'sold' });
        res.json({ message: 'Ad marked as sold', ad });
    } catch (error) {
        console.error('Error marking ad as sold:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

