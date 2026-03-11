const User = require('./User');
const Wallet = require('./Wallet');

User.hasMany(Wallet, { foreignKey: 'userId', as: 'wallets' });
Wallet.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

module.exports = {
  User,
  Wallet,
  Transaction: require('./Transaction')
};
