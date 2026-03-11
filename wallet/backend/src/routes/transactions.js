const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/ramp-on', transactionController.createRampOn);
router.post('/ramp-off', transactionController.createRampOff);
router.get('/', transactionController.getTransactions);
router.get('/rates', transactionController.getExchangeRates);
router.get('/:id', transactionController.getTransactionById);

module.exports = router;
