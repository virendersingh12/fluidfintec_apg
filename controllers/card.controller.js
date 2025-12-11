const debug = require('debug');
const error = debug('edex:rout:cards:error');
const log = debug('edex:rout:cards');
const config = require('config');
const stellar = require('../service/stellar');
const Merchant = require('../models/merchant');

const buy = async (req, res) => {
    const { user_id, asset, amount } = req;

    try {
        const merchant = await Merchant.findById(user_id);
        const options = {
            from_secret: config.get('stellar.distribution'),
            to_account: merchant.publicKey,
            asset: asset,
            amount: amount
        };

        const result = stellar.credit.creditAccount(options);

        return res.json({result, ok: true});
    } catch (err) {
        error(err);
        return res.json({error: 'error processing payment', ok: false})
    }
};

module.exports = {
    buy
};
