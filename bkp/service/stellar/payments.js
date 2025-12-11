const debug = require('debug');
const error = debug('edex:stell:pay:error');
const log = debug('edex:stell:pay');
const utils = require('./utils');

const StellarSdk = require('stellar-sdk');
StellarSdk.Network.use(utils.getNetwork())
const server = utils.getServer();
const Merchant = require('../../models/merchant');
const merchantStellarTxRepository = require('../../repository/merchantStellarTx.repository');

const sendPayment = (options) => {
    console.log("Send Payment")
    const keypair = StellarSdk.Keypair.fromSecret(options.from_secret);
    return server.loadAccount(keypair.publicKey())
        .then(async account => {
            let merchant_account = 'GANFNPUKDZ4U4WT6S2VJYRLG5Z3G3FNGUQYMHAUEV3NB4ODTHRNXU5YQ';
            let builder = new StellarSdk.TransactionBuilder(account, { fee: 500 });
            let merchant = await Merchant.find({ publicKey: options.to_account });
            let rolling_reserve_account = merchant[0].rolling_reserve_account_id;
            let rolling_res = (merchant[0].rolling_reserve_pct * options.amount) / 100;
            let rolling_reserve_amount = rolling_res.toString();
            let fee_receivable = (merchant[0].fee_receivable_pct * options.amount) / 100;
            let merchant_fee = fee_receivable.toString();

            builder.addOperation(
                    StellarSdk.Operation.payment({
                        destination: options.to_account,
                        asset: utils.getAsset(options.asset),
                        amount: options.amount
                    })
                )
                //Rolling Reserve
            builder.addOperation(
                    StellarSdk.Operation.payment({
                        destination: rolling_reserve_account,
                        asset: utils.getAsset(options.asset),
                        amount: rolling_reserve_amount,
                        source: options.to_toAccount
                    })
                )
                //Merchant Fee
            builder.addOperation(
                StellarSdk.Operation.payment({
                    destination: merchant_account,
                    asset: utils.getAsset(options.asset),
                    amount: merchant_fee,
                    source: options.to_toAccount
                })
            );

            if (options.memo) builder.addMemo(StellarSdk.Memo.text(options.memo));
            let transaction = builder.build()
            transaction.sign(keypair);
            return server.submitTransaction(transaction)
                .then(
                    res => {
                        log('success: credit sent');
                        merchantStellarTxRepository.createTransaction(res.hash, 'sell')
                            .then(
                                res => {
                                    log('success: transaction created');
                                }
                            );
                        return res;
                    },
                    err => { throw err }
                )
        })
}

module.exports = {
    sendPayment: sendPayment
}
