const { Transaction, Ad, User, sequelize } = require('../models');
// const { paymentSchema } = require('../utils/validation'); // RETIRÉ - Validation désactivée

// MOCK Payment Gateway (Simulating Stripe/PayPal)
// In a real app, this would use an SDK like `stripe.paymentIntents.create`
const mockPaymentGateway = async (cardData, amount) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random failure (e.g. insufficient funds) for demonstration (5% chance)
            if (Math.random() < 0.05) {
                return reject(new Error('Declined: Insufficient funds'));
            }

            // Return a mock token
            resolve({
                id: 'tok_' + Math.random().toString(36).substr(2, 9),
                status: 'succeeded'
            });
        }, 1000); // Simulate network delay
    });
};

const { z } = require('zod');

// Schema local pour le paiement (puisque l'import externe était désactivé)
const paymentSchema = z.object({
    adId: z.string().uuid(),
    cardNumber: z.string().min(13).max(19),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/),
    cvv: z.string().min(3).max(4),
    cardHolderName: z.string().min(2)
});

exports.purchaseAd = async (req, res) => {
    const t = await sequelize.transaction(); // SQL Transaction for ACID compliance

    try {
        // Business Logic Validation
        const ad = await Ad.findByPk(req.body.adId);
        if (!ad) {
            await t.rollback();
            return res.status(404).json({ message: 'Ad not found' });
        }

        if (ad.status === 'sold') {
            await t.rollback();
            return res.status(400).json({ message: 'This item is already sold' });
        }

        if (ad.userId === req.user.userId) {
            await t.rollback();
            return res.status(400).json({ message: 'You cannot buy your own ad' });
        }

        // Validate payment data
        const validatedPayment = paymentSchema.parse({
            adId: req.body.adId,
            cardNumber: req.body.cardNumber,
            expiryDate: req.body.expiryDate,
            cvv: req.body.cvv,
            cardHolderName: req.body.cardHolderName
        });

        const paymentResult = await mockPaymentGateway({
            number: validatedPayment.cardNumber,
            exp: validatedPayment.expiryDate,
            cvc: validatedPayment.cvv
        }, ad.price);

        // 4. Record Transaction (Storing SAFE data only)
        const transaction = await Transaction.create({
            amount: ad.price,
            status: 'completed',
            buyerId: req.user.userId,
            sellerId: ad.userId,
            adId: ad.uuid,
            paymentToken: paymentResult.id,
            // SECURITY: Store only the last 4 digits for reference
            maskedCardNumber: `**** **** **** ${req.body.cardNumber?.slice(-4) || '****'}`
        }, { transaction: t });

        // 5. Update Ad Status
        ad.status = 'sold';
        await ad.save({ transaction: t });

        await t.commit();

        res.status(201).json({
            message: 'Payment successful',
            transactionId: transaction.uuid,
            item: ad.title
        });

    } catch (error) {
        await t.rollback();
        res.status(400).json({ message: 'Payment failed', error: error.message });
    }
};

exports.getMyPurchases = async (req, res) => {
    try {
        const purchases = await Transaction.findAll({
            where: { buyerId: req.user.userId },
            include: [{ model: Ad, attributes: ['title', 'price', 'imageUrl'] }]
        });
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMySales = async (req, res) => {
    try {
        const sales = await Transaction.findAll({
            where: { sellerId: req.user.userId },
            include: [{ model: Ad, attributes: ['title', 'price'] }]
        });
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
