const Transaction = require('../models/Transaction');
const { Wallet } = require('../models');
const axios = require('axios');

const CRYPTO_API_URL = process.env.CRYPTO_API_URL;

const getExchangeRate = async (crypto, fiat = 'chf') => {
  try {
    const response = await axios.get(`${CRYPTO_API_URL}/simple/price`, {
      params: {
        ids: crypto,
        vs_currencies: fiat
      }
    });
    return response.data[crypto]?.[fiat];
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return null;
  }
};

exports.createRampOn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, cryptoCurrency, paymentMethod, walletAddress, bankDetails } = req.body;

    const exchangeRate = await getExchangeRate(cryptoCurrency.toLowerCase());
    if (!exchangeRate) {
      return res.status(400).json({ message: 'Unable to get exchange rate for this currency' });
    }

    const amountCrypto = amount / exchangeRate;
    const fees = amountCrypto * 0.01;

    const transaction = await Transaction.create({
      userId,
      type: 'RAMP_ON',
      cryptoCurrency: cryptoCurrency.toUpperCase(),
      amount: amountCrypto,
      amountFiat: amount,
      fiatCurrency: 'CHF',
      paymentMethod,
      walletAddress,
      bankDetails,
      exchangeRate,
      fees,
      status: 'PENDING'
    });

    res.status(201).json({
      message: 'Ramp On transaction created',
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        amountFiat: transaction.amountFiat,
        status: transaction.status,
        exchangeRate: transaction.exchangeRate
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createRampOff = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, cryptoCurrency, walletAddress, bankDetails } = req.body;

    const exchangeRate = await getExchangeRate(cryptoCurrency.toLowerCase());
    if (!exchangeRate) {
      return res.status(400).json({ message: 'Unable to get exchange rate for this currency' });
    }

    const amountFiat = amount * exchangeRate;
    const fees = amountFiat * 0.015;

    const transaction = await Transaction.create({
      userId,
      type: 'RAMP_OFF',
      cryptoCurrency: cryptoCurrency.toUpperCase(),
      amount,
      amountFiat,
      fiatCurrency: 'CHF',
      paymentMethod: 'BANK_TRANSFER',
      walletAddress,
      bankDetails,
      exchangeRate,
      fees,
      status: 'PENDING'
    });

    res.status(201).json({
      message: 'Ramp Off transaction created',
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        amountFiat: transaction.amountFiat,
        fees: transaction.fees,
        status: transaction.status,
        exchangeRate: transaction.exchangeRate
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, status, limit = 50, offset = 0 } = req.query;

    const filter = { userId };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findOne({ _id: id, userId });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getExchangeRates = async (req, res) => {
  try {
    const { currencies } = req.query;
    const currencyList = currencies ? currencies.split(',') : ['bitcoin', 'ethereum', 'tether'];

    const response = await axios.get(`${CRYPTO_API_URL}/simple/price`, {
      params: {
        ids: currencyList.join(','),
        vs_currencies: 'chf,usd,eur'
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exchange rates', error: error.message });
  }
};
