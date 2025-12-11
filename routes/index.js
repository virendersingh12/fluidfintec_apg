const router = require('express').Router();
const debug = require('debug')('edex:rout');

const logger = function (req, res, next) {
    debug(req.sessionID, req.originalUrl);
    next()
};

router.use(logger);
router.use('/api/session', require('./auth.route'));
router.use('/api/stellar/', require('./stellar.route'));
router.use('/api/seller/', require('./seller.route'));
router.use('/api/cards/', require('./cards.route'));
router.use('/api/card/', require('./cardstream.route'));
router.use('/api/transactions', require('./transactions.route'));
router.use('/api/webhook', require('./webhook.route'));
router.use('/api/document', require('./documents.route'));
router.use('/api/merchants', require('./merchants.route'));
router.use('/api/user', require('./users.route'));
router.use('/api/test', require('./testApi'))
router.use('/api', require('./worldnet.route'));


module.exports = router;
