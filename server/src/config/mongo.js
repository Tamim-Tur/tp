const mongoose = require('mongoose');

const connectMongo = async () => {
    if (!process.env.MONGO_URI) {
        console.log('MONGO_URI not found in .env, skipping MongoDB connection.');
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected via Mongoose');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

module.exports = connectMongo;
