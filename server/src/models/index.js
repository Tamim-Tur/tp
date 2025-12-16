const sequelize = require('../config/database');
const User = require('./User');
const Ad = require('./Ad');

// Associations
User.hasMany(Ad, { foreignKey: 'userId', as: 'ads' });
Ad.belongsTo(User, { foreignKey: 'userId', as: 'seller' });

module.exports = {
    sequelize,
    User,
    Ad
};
