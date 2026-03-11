const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['RAMP_ON', 'RAMP_OFF'],
    required: true
  },
  cryptoCurrency: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  amountFiat: {
    type: Number,
    required: true
  },
  fiatCurrency: {
    type: String,
    default: 'CHF'
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  paymentMethod: {
    type: String,
    enum: ['BANK_TRANSFER', 'CREDIT_CARD', 'CRYPTO_WALLET'],
    required: true
  },
  walletAddress: {
    type: String
  },
  bankDetails: {
    accountNumber: String,
    iban: String,
    swift: String,
    bankName: String
  },
  transactionHash: {
    type: String
  },
  exchangeRate: {
    type: Number
  },
  fees: {
    type: Number,
    default: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
