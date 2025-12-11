const sellercontroller = require('../controllers/seller.controller')
const router = require('express').Router();


router.get('/transactions', sellercontroller.transactions);
router.post('/orderTopup/:seller_id', sellercontroller.postOrderTopup);
router.post('/giftCardOrders/:seller_id', sellercontroller.postOrderTopup);
router.get('/listProduct', sellercontroller.listProduct);
router.post('/payment', sellercontroller.payment);
router.post('/paymentDetails', sellercontroller.paymentDetails);


module.exports = router;
