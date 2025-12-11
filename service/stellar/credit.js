const debug = require('debug');
const error = debug('edex:stell:pay:error');
const log = debug('edex:stell:pay');
const utils = require('./utils');
const config = require('config');

const StellarSdk = require('stellar-sdk');
StellarSdk.Network.use(utils.getNetwork());

const merchantStellarTxRepository = require('../../repository/merchantStellarTx.repository');

const server = utils.getServer();

const creditAccount = (options) => {
    const keypair = StellarSdk.Keypair.fromSecret(config.get('stellar.distribution'));

    return server.loadAccount(keypair.publicKey())
        .then(
            account => {
                let builder = new StellarSdk.TransactionBuilder(account, { fee: 15000 });

                builder.addOperation(StellarSdk.Operation.changeTrust({
                    asset: utils.getAsset(options.asset),
                    source: keypair.publicKey()
                }))

                builder.addOperation(
                    StellarSdk.Operation.payment({
                        destination: options.to_account,
                        asset: utils.getAsset(options.asset),
                        amount: options.amount + '',
                    })
                );
                if (options.memo) builder.addMemo(StellarSdk.Memo.text(options.memo));
                let transaction = builder.build();
                console.log(transaction)
                transaction.sign(keypair);
                console.log("before submitTransaction!!!!!!")
                console.log(transaction)
                return server.submitTransaction(transaction)
                    .then(
                        res => {
                            log('success: credit sent');
                            return merchantStellarTxRepository.createTransaction(res.hash, 'buy');
                        },
                        err => {
                            console.log("submitTransaction!!!!!! ERROR!!!!")
                            console.log(err);
                            throw err;
                        }
                    )

            }
        )
        .catch(function(error) {
            console.error('Error!', error);
            console.error("#############################")
            console.error("#############################")
            console.error("#############################")
            console.error("#############################")
            console.error(error.response.data.extras)
        });
};

module.exports = {
    creditAccount: creditAccount
};
