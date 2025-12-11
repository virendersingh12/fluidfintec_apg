const router = require('express').Router();
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/hash/:hash', transactionController.getTransaction);


router.post('/poynt', authMiddleware, transactionController.getTransactionPoynt)

router.get('/poynt/:id', authMiddleware, transactionController.getTransactionPoyntByid)

router.get('/', authMiddleware, transactionController.getTransactionWithPagination);

router.post('/transaction', transactionController.successAPI);
router.post('/transactionNew', transactionController.successAPINew);
router.post('/transactionNew2', transactionController.successAPINew2);
router.post('/transactionNew3', transactionController.successAPINew3);
router.post('/transactionNew4', transactionController.successAPINew4);
router.post('/transactionNew5', transactionController.successAPINew5);
router.post('/sendUserEmail', transactionController.sendUserEmail);
router.post('/sendUserEmailNew', transactionController.sendUserEmailNew);
router.post('/sendUserEmailNew1', transactionController.sendUserEmailNew1);
router.post('/transferfund', transactionController.transerfund);
module.exports = router;
