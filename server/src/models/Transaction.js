const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
    },
    // SECURITY: We never store the full PAN (Primary Account Number)
    maskedCardNumber: { // Stores only last 4 digits "************1234"
        type: DataTypes.STRING,
        allowNull: false
    },
    paymentToken: { // Represents the reliable token from the payment provider (Stripe, etc.)
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Transaction;
