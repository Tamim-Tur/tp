const { z } = require('zod');

const registerSchema = z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(8).regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

const adSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10),
    price: z.number().nonnegative(),
    imageUrl: z.string().optional()
});

module.exports = {
    registerSchema,
    loginSchema,
    adSchema,
    paymentSchema: z.object({
        adId: z.string().uuid(),
        cardNumber: z.string().regex(/^\d{16}$/, "Invalid card number format (must be 16 digits)"),
        expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid expiry date (MM/YY)"),
        cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV"),
        cardHolderName: z.string().min(2)
    })
};
