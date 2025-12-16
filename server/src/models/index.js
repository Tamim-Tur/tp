const sequelize = require('../config/database');
const User = require('./User');
const Ad = require('./Ad');
const Transaction = require('./Transaction');

// Associations
User.hasMany(Ad, { foreignKey: 'userId', as: 'ads' });
Ad.belongsTo(User, { foreignKey: 'userId', as: 'seller' });

User.hasMany(Transaction, { foreignKey: 'buyerId', as: 'purchases' });
User.hasMany(Transaction, { foreignKey: 'sellerId', as: 'sales' });
Transaction.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
Transaction.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

Transaction.belongsTo(Ad, { foreignKey: 'adId' });
Ad.hasOne(Transaction, { foreignKey: 'adId' });

module.exports = {
    sequelize,
    User,
    Ad,
    Transaction
};
