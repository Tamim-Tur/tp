const { Ad, User } = require('../models');
// const { adSchema } = require('../utils/validation'); // RETIRÉ - Validation désactivée

exports.createAd = async (req, res) => {
    try {
        // VULNÉRABILITÉ CRITIQUE (démo): Aucune validation des données
        // Permet:
        // - XSS via title/description non sanitisés
        // - Prix négatifs ou invalides
        // - Injection de contenu malveillant
        // - Données corrompues en base

        let imageUrl = req.body.imageUrl || '';

        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        } else if (imageUrl === '') {
            imageUrl = null;
        }

        const ad = await Ad.create({
            title: req.body.title,
            description: req.body.description,
            price: parseFloat(req.body.price),
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
            // where: { status: 'available' }, // removed to show sold items
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

        // VULNÉRABILITÉ (démo): Pas de validation lors de la mise à jour

        let imageUrl = ad.imageUrl;

        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        } else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl;
        }

        await ad.update({
            title: req.body.title,
            description: req.body.description,
            price: parseFloat(req.body.price),
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

