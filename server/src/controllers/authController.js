const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
// const { registerSchema, loginSchema } = require('../utils/validation'); // RETIRÉ - Validation désactivée

exports.register = async (req, res) => {
    try {
        // VULNÉRABILITÉ CRITIQUE (démo): Aucune validation des données d'entrée
        // Permet:
        // - Mots de passe faibles (ex: "123", "password")
        // - Emails invalides
        // - Username trop courts ou contenant des caractères dangereux
        // - Injection SQL potentielle
        // - XSS via username non sanitisé

        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        res.status(201).json({ message: 'User created successfully', userId: user.uuid });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        // VULNÉRABILITÉ (démo): Pas de validation du format email/password
        // Facilite les attaques par force brute et injection

        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.uuid, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // VULNÉRABILITÉ (démo): Cookie sans 'secure' flag
        // Le cookie peut être intercepté sur HTTP
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // DANGEREUX: permet transmission en HTTP non chiffré
            sameSite: 'lax', // Moins strict que 'strict'
            maxAge: 3600000 // 1 hour
        });

        res.json({ message: 'Logged in successfully', user: { username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });
    res.json({ message: 'Logged out successfully' });
};

exports.me = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, { attributes: ['uuid', 'username', 'email', 'role'] });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
