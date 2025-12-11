const debug = require('debug');
const error = debug('edex:rout:stell:error');
const log = debug('edex:rout:stell');
const Stellar = require('../service/stellar');
const Merchant = require('../models/merchant');

const paymentStellar = async (req, res) => {
    const { body = {}, user } = req;
    const { to_account, amount, memo = '' } = body;

    try {
        const merchant = await Merchant.findById(user.id);
        const options = {
            to_account: to_account,
            asset: asset,
            amount: amount,
            from_secret: merchant.secretKey,
            memo: memo
        };

        await Stellar.payments.sendPayment(options);

        return res.json({ ok: true });
    } catch (err) {
        error(err);

        return res.json({ error: 'error sending payment', ok: false });
    }
};

const paymentStellarEcommerce = async (req, res) => {
    const { body = {} } = req;
    const { to_account, asset, amount, memo = '', token, from_account } = body;

    const validTokens = ['UOZxK5yGpq8QcXiycH3JlL5ICOLLA3-p'];

    try {
        if (validTokens.includes(token)) {
            const merchant = await Merchant.findById(from_account);
            const purchaseData = {
                to_account,
                asset,
                amount,
                from_secret: merchant.secretKey,
                memo,
            };
            await Stellar.payments.sendPayment(purchaseData);

            return res.json({ ok: true });
        }

        console.log('Token is invalid');
        return res.json({ error: 'error sending payment', ok: false });
    } catch (err) {
        error(err);
        return res.json({ error: 'error sending payment', ok: false });
    }
};

const exchange = async (req, res) => {
    const { user, body } = req;

    try {
        const merchant = await Merchant.findById(user.id);
        await Stellar.exchange.ownAssets(merchant, body);

        return res.json({ ok: true });
    } catch (err) {
        error(err);
        return res.json({ error: 'error exchanging asset', ok: false })
    }
};

module.exports = {
    paymentStellar,
    paymentStellarEcommerce,
    exchange,
};
