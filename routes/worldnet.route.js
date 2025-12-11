const router = require('express').Router();
const payment = require("../controllers/worldnet.controller")

// const router = express.Router();

router.post('/pay', payment.postPayment);
router.get('/payments/:uniqueReference', payment.getPaymentDetails);
router.post('/sendWorldnetTransactionEmail', payment.sendWorldnetTransactionEmail);


module.exports = router;
