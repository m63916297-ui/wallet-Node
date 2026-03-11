const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');

const Wallet = sequelize.define('Wallet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  currency: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  balance: {
    type: DataTypes.DECIMAL(20, 8),
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  label: {
    type: DataTypes.STRING(100)
  }
}, {
  tableName: 'wallets',
  timestamps: true
});

module.exports = Wallet;
