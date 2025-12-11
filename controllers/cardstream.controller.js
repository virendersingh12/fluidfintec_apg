const debug = require('debug');
const error = debug('edex:rout:card:error');
const log = debug('edex:rout:card');

const cardstreamService = require('../service/cardStream.service');
const config = require('config');
const Merchant = require("../models/merchant");
const {MERCHANT_STATUS} = require("../constants/merchantStatus");
const transactions = require("../service/stellar/transactions");

const purchase = async (req, res) => {
    try {
        const merchant = await Merchant.findById(req.user.id);
        if (merchant.status === MERCHANT_STATUS.APPROVED ){

            const transactionRes = await transactions.getRecentOperations(merchant.publicKey)
            const recentOperations = transactionRes['records'].filter(r => r['type'] === 'payment')

            if(recentOperations === 0){
                merchant.status = MERCHANT_STATUS.PROCESSING;
                await merchant.save();
            }
        }

        const result = await cardstreamService.purchase(req, res);

        return res.json({ result, ok : true });
    } catch (err) {
        error(err);
        return res.json({ error : 'error processing payment', ok : false });
    }
};

const callback = async (req, res) => {
    try {
        const result = await cardstreamService.callback(req, res);
        return res.json({ result, ok : true });
    } catch (err) {
        error(err);
        return res.json({ error : 'error processing callback', ok : false });
    }
};

const serialise = (params) => {
    const str = [];
    Object.entries(params).forEach(
        ([key, value]) => {
            str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        }
    );
    return str.join("&");
};

const redirectWithParams = (response, params, type) => {
    let url = `${ config.get('client.mamm.url') }/buy-and-sell/complete`

    if(type === 'shop') {
        url = `${ config.get('client.shop.url') }/complete/`
    }

    const query = serialise(params);
    response.redirect(url + query);
};

const mammRedirect = async (req, res) => {
    try {
        const result = await cardstreamService.redirect(req, res);
        console.log(result);
        redirectWithParams(res, result, 'mamm');
    } catch (err) {
        redirectWithParams(res, { error: 'could not complete payment' }, 'mamm');
        error(err);
    }
};

const shopRedirect = async (req, res) => {
    try {
        const result = await cardstreamService.redirect(req, res);
        console.log(result);
        redirectWithParams(res, result, 'shop');
    } catch (err) {
        redirectWithParams(res, { error: 'could not complete payment' }, 'shop');
        error(err);
    }
};

module.exports = {
    purchase,
    callback,
    mammRedirect,
    shopRedirect,
};
