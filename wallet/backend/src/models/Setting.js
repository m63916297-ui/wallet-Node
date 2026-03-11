const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  category: {
    type: String,
    enum: ['GENERAL', 'CRYPTO', 'PAYMENT', 'FEES', 'LIMITS', 'API', 'SECURITY'],
    default: 'GENERAL'
  },
  description: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isEditable: {
    type: Boolean,
    default: true
  },
  dataType: {
    type: String,
    enum: ['STRING', 'NUMBER', 'BOOLEAN', 'JSON'],
    default: 'STRING'
  }
}, {
  timestamps: true
});

const defaultSettings = [
  {
    key: 'PLATFORM_NAME',
    value: 'Swiss Crypto Ramp',
    category: 'GENERAL',
    description: 'Nombre de la plataforma',
    isPublic: true,
    isEditable: true,
    dataType: 'STRING'
  },
  {
    key: 'PLATFORM_COUNTRY',
    value: 'Switzerland',
    category: 'GENERAL',
    description: 'País de sede',
    isPublic: true,
    isEditable: false,
    dataType: 'STRING'
  },
  {
    key: 'FIAT_CURRENCY',
    value: 'CHF',
    category: 'GENERAL',
    description: 'Moneda fiat principal',
    isPublic: true,
    isEditable: false,
    dataType: 'STRING'
  },
  {
    key: 'SUPPORTED_CRYPTOS',
    value: ['BTC', 'ETH', 'USDT'],
    category: 'CRYPTO',
    description: 'Criptomonedas soportadas',
    isPublic: true,
    isEditable: true,
    dataType: 'JSON'
  },
  {
    key: 'RAMP_ON_FEE',
    value: 1.0,
    category: 'FEES',
    description: 'Comisión Ramp On (%)',
    isPublic: true,
    isEditable: true,
    dataType: 'NUMBER'
  },
  {
    key: 'RAMP_OFF_FEE',
    value: 1.5,
    category: 'FEES',
    description: 'Comisión Ramp Off (%)',
    isPublic: true,
    isEditable: true,
    dataType: 'NUMBER'
  },
  {
    key: 'MIN_TRANSACTION_AMOUNT',
    value: 100,
    category: 'LIMITS',
    description: 'Monto mínimo de transacción (CHF)',
    isPublic: true,
    isEditable: true,
    dataType: 'NUMBER'
  },
  {
    key: 'MAX_TRANSACTION_AMOUNT',
    value: 50000,
    category: 'LIMITS',
    description: 'Monto máximo de transacción (CHF)',
    isPublic: true,
    isEditable: true,
    dataType: 'NUMBER'
  },
  {
    key: 'KYC_ENABLED',
    value: true,
    category: 'SECURITY',
    description: 'Habilitar verificación KYC',
    isPublic: true,
    isEditable: true,
    dataType: 'BOOLEAN'
  },
  {
    key: 'MAINTENANCE_MODE',
    value: false,
    category: 'GENERAL',
    description: 'Modo mantenimiento',
    isPublic: false,
    isEditable: true,
    dataType: 'BOOLEAN'
  },
  {
    key: 'CRYPTO_API_URL',
    value: 'https://api.coingecko.com/api/v3',
    category: 'API',
    description: 'URL API de criptomonedas',
    isPublic: false,
    isEditable: true,
    dataType: 'STRING'
  },
  {
    key: 'PAYMENT_METHODS',
    value: ['BANK_TRANSFER', 'CREDIT_CARD'],
    category: 'PAYMENT',
    description: 'Métodos de pago disponibles',
    isPublic: true,
    isEditable: true,
    dataType: 'JSON'
  }
];

settingSchema.statics.initDefaults = async function() {
  for (const setting of defaultSettings) {
    await this.findOneAndUpdate(
      { key: setting.key },
      setting,
      { upsert: true, new: true }
    );
  }
  console.log('Default settings initialized');
};

module.exports = mongoose.model('Setting', settingSchema);
