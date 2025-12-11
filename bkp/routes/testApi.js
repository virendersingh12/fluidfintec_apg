const router = require('express').Router();
const transactionController = require('../controllers/test.controller');

router.get('/', transactionController.getTransactionWithPagination);
router.get('/delete', transactionController.deleteTransaction);



module.exports = router;
