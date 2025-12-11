const authMiddleware = require('../middleware/authMiddleware');
const apiAuthMiddleware = require('../middleware/apiAuthMiddleware');

const router = require('express').Router();
const stellarController = require('../controllers/stellar.controller');

router.put('/payment/stellar', authMiddleware, stellarController.paymentStellar);

router.put('/payment/stellar/react-ecommerce', apiAuthMiddleware, stellarController.paymentStellar);

router.put('/payment/stellar/ecommerce', authMiddleware, stellarController.paymentStellarEcommerce);

router.put('/exchange', authMiddleware, stellarController.exchange);

module.exports = router;
