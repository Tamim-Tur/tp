const sequelize = require('../config/database');
const User = require('./User');
const Ad = require('./Ad');
const Transaction = require('./Transaction');
const Message = require('./Message');

// Associations
User.hasMany(Ad, { foreignKey: 'userId', as: 'ads' });
Ad.belongsTo(User, { foreignKey: 'userId', as: 'seller' });

User.hasMany(Transaction, { foreignKey: 'buyerId', as: 'purchases' });
User.hasMany(Transaction, { foreignKey: 'sellerId', as: 'sales' });
Transaction.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
Transaction.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

Transaction.belongsTo(Ad, { foreignKey: 'adId', as: 'ad' });
Ad.hasOne(Transaction, { foreignKey: 'adId' });

// Messaging Associations
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
Message.belongsTo(Ad, { foreignKey: 'adId', as: 'ad' }); // Optional: Context of ad

module.exports = {
    sequelize,
    User,
    Ad,
    Transaction,
    Message
};
