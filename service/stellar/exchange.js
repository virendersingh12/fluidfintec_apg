const debug = require('debug');
const error = debug('edex:stell:ex:error');
const log = debug('edex:stell:ex');
const utils = require('./utils');
const config = require('config');

const StellarSdk = require('stellar-sdk');
StellarSdk.Network.use(utils.getNetwork())
const server = utils.getServer();

// { 
//     amount: '1',
//     initial_asset: 'EDXG',
//     new_asset: 'EDXG',
//     user_public_key: ''
// }


STATIC_RATES = {
    // ICET : {
    //     ECPS: 0.86,
    //     ECPU: 1.14
    // },
    // ECPS : {
    //     ICET: 1.16,
    //     ECPU: 1.32
    // },
    // ECPU : {
    //     ICET: 0.86,
    //     ECPS: 0.76
    // }
}

const ownAssets = (merchant, options) => {

    const user_keypair = StellarSdk.Keypair.fromSecret(merchant.secretKey)
    const dist_keypair = StellarSdk.Keypair.fromSecret(config.get('stellar.distribution'))

    return server.loadAccount(user_keypair.publicKey())
    .then(
        account => {

            const to_exchange = utils.getAssetFromAccount(account, options.initial_asset)

            if( parseFloat(options.amount) > parseFloat(to_exchange.balance) ){
                throw Error('Insufficient funds')
            }

            const conversion = (STATIC_RATES[options.initial_asset][options.new_asset] * parseFloat(options.amount)).toFixed(2);

            let builder = new StellarSdk.TransactionBuilder(account);

            builder.addOperation(
                StellarSdk.Operation.payment({
                    destination: dist_keypair.publicKey(),
                    asset: utils.getAsset(options.initial_asset),
                    amount: options.amount.toFixed(2)
                })
            )

            builder.addOperation(
                StellarSdk.Operation.payment({
                    destination: user_keypair.publicKey(),
                    asset: utils.getAsset(options.new_asset),
                    amount: conversion,
                    source: dist_keypair.publicKey()
                })
            )

            let transaction = builder.build()
            transaction.sign(user_keypair, dist_keypair);

            return server.submitTransaction(transaction)
            .then(
                res => {
                    log('Success! Payment sent');
                    log(res)
                },
                err => { throw err }
            )

        }
    )
}

module.exports = {
    ownAssets : ownAssets
}
