const router = require('express').Router();
const webhookController = require('../controllers/webhook.controller');

router.get('/webhookCall', webhookController.getTransactionPoynt);
router.get('/webhookCall2', webhookController.getTransactionPoynt2);
router.get('/createNewHook', webhookController.createHookBusiness);
router.get('/getHookBusiness', webhookController.getHookBusiness);
router.delete('/deleteHook', webhookController.deleteHookBusiness);
router.get('/test',webhookController.successAPI);

module.exports = router;
