const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ad = sequelize.define('Ad', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        } // Prevent empty strings
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    status: {
        type: DataTypes.ENUM('available', 'sold'),
        defaultValue: 'available'
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
        // Removed isUrl validation to allow relative paths (/uploads/..., /images/...)
    },
    // Foreign key will be added in associations
});

module.exports = Ad;
