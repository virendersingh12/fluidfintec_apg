const sellercontroller = require('../controllers/seller.controller')
// const authMiddleware = require('../middleware/authMiddleware');

const router = require('express').Router();


router.get('/transactions', sellercontroller.transactions);
router.post('/orderTopup/:seller_id', sellercontroller.postOrderTopup);
router.post('/giftCardOrders/:seller_id', sellercontroller.postOrderTopup);
router.get('/listProduct', sellercontroller.listProduct);
router.post('/payment', sellercontroller.payment);
router.post('/paymentDetails', sellercontroller.paymentDetails);
router.get('/getTransactions', sellercontroller.getTransactions);
router.get('/getPaymentProcessor', sellercontroller.getPaymentProcessor);
router.post('/stripePayment', sellercontroller.stripePayment);
router.post('/deleteUser', sellercontroller.deleteUser);
router.post('/phoneTopup/:seller_id', sellercontroller.phoneTopup);





module.exports = router;
