const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { registerSchema, loginSchema } = require('../utils/validation'); // ✅ Validation réactivée

exports.register = async (req, res) => {
    try {
        // Validate input data
        const validatedData = registerSchema.parse(req.body);

        const existingUser = await User.findOne({ where: { email: validatedData.email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        const user = await User.create({
            username: validatedData.username,
            email: validatedData.email,
            password: hashedPassword
        });

        res.status(201).json({ message: 'User created successfully', userId: user.uuid });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const user = await User.findOne({ where: { email: validatedData.email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(validatedData.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.uuid, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Secure cookies configuration
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 3600000
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
