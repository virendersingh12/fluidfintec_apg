const utils = require("./utils");
const StellarSdk = require("stellar-sdk");
const Merchant = require("../../models/merchant");
const Transaction = require("../../models/Transaction");
StellarSdk.Network.use(utils.getNetwork());
const emailService = require('../email.service')
const server = utils.getServer();
const stellar = require('./index')
const axios = require('axios');

const {
    generateStellarKey
} = require("../../helpers/apiKeyFuncs");

const creditAccount = async (options) => {
    console.log("in user credit service", options);
    let merchantEmail = options.merchant.email,
        merchantName = options.merchant.contactName,
        customerEmail = options.userDetail.email || "",
        customerName = options.userDetail.cardHolderFirstName,
        from_secret = options.merchant.secretKey,
        from_public = options.merchant.publicKey,
        to_account = options.userDetail.publicKey,
        asset = options.asset,
        amount = options.amount;

    try {
        if (!to_account) {
            const { publicKey, secretKey } = generateStellarKey();
            await stellar.accounts.initialiseAccount(secretKey)
            await Merchant.findOneAndUpdate({ email: customerEmail }, { publicKey, secretKey });
            to_account = publicKey
        }
        const merchantDetail = await Merchant.findOne({ email: merchantEmail });
        let sourceKeys = StellarSdk.Keypair.fromSecret(from_secret);
        console.log(amount);
        return await server
            .loadAccount(to_account)
            .catch(function (error) {
                if (error instanceof StellarSdk.NotFoundError) {
                    throw new Error("The destination account does not exist!");
                } else return error;
            })
            .then(function () {
                return server.loadAccount(from_public);
            })
            .then(async function (sourceAccount) {
                let newTransaction = new StellarSdk.TransactionBuilder(
                    sourceAccount,
                    {
                        fee: StellarSdk.BASE_FEE,
                        networkPassphrase: StellarSdk.Networks.TESTNET,
                    }
                )
                    .addOperation(
                        StellarSdk.Operation.payment({
                            destination: to_account,
                            asset: StellarSdk.Asset.native(),
                            amount: amount + "",
                        })
                    )
                    .addMemo(StellarSdk.Memo.text(""))
                    // .setTimeout(180)
                    .build();
                newTransaction.sign(sourceKeys);
                return await server.submitTransaction(newTransaction);
            })
            .then(async function (result) {
                const data = { ...options.StoreData, stellarToken: result.paging_token }
                console.log("here in 55", data);
                const neewTransaction = await Transaction.findOne({ transactionId: data.transactionId });
                if (!neewTransaction) {
                    await Transaction.create(data);
                }
                if (
                    merchantEmail != null &&
                    merchantEmail != undefined &&
                    merchantEmail != ""
                ) {
                    console.log(merchantDetail);
                    await emailService.sendTransactionCompleteMerchant(
                        merchantEmail,
                        options.merchant,
                        from_secret,
                        new Date()
                    );
                }
                if (
                    customerEmail != null &&
                    customerEmail != undefined &&
                    customerEmail != ""
                ) {
                    await emailService.sendTransactionCompleteUser(
                        customerEmail,
                        options.userDetail,
                        to_account,
                        new Date()
                    );
                }
                return "Success! Results:", result;
            })
            .catch(function (error) {
                console.error("Something went wrong!", error);
                console.error(
                    "Something went wrong!",
                    error.response.data.extras
                );
                throw error;
            });
    } catch (error) {
        throw error;
    }
};

const creditAccountNew = async (options) => {
    console.log("in user credit service");
    let from_secret = options.merchant.secretKey,
        from_public = options.merchant.publicKey,
        to_account = options.userDetail.publicKey,
        amount = options.amount / 100;

    try {
        if (!to_account) {
            const { publicKey, secretKey } = generateStellarKey();
            await stellar.accounts.initialiseAccount(secretKey)
            await Merchant.findOneAndUpdate({ email: customerEmail }, { publicKey, secretKey }, { upsert: true, new: true });
            to_account = publicKey
        }
        let sourceKeys = StellarSdk.Keypair.fromSecret(from_secret);
        console.log(amount);
        return await server
            .loadAccount(to_account)
            .catch(function (error) {
                if (error instanceof StellarSdk.NotFoundError) {
                    throw new Error("The destination account does not exist!");
                } else return error;
            })
            .then(function () {
                return server.loadAccount(from_public);
            })
            .then(async function (sourceAccount) {
                console.log(sourceAccount, parseFloat(sourceAccount.balances[0].balance) < parseFloat(amount), sourceAccount.balances[0].asset_type, StellarSdk.Asset.native(),)
                if (sourceAccount) {
                    if (parseFloat(sourceAccount.balances[0].balance) < parseFloat(amount)) {
                        throw new Error("Merchant account have Insufficient funds!");
                    } else {
                        let newTransaction = new StellarSdk.TransactionBuilder(
                            sourceAccount,
                            {
                                fee: StellarSdk.BASE_FEE,
                                networkPassphrase: StellarSdk.Networks.TESTNET,
                            }
                        )
                            .addOperation(
                                StellarSdk.Operation.payment({
                                    destination: to_account,
                                    asset: StellarSdk.Asset.native(),
                                    amount: amount + "",
                                })
                            )
                            .addMemo(StellarSdk.Memo.text(""))
                            // .setTimeout(180)
                            .build();
                        newTransaction.sign(sourceKeys);
                        return await server.submitTransaction(newTransaction);
                    }
                }


            })
            .then(async function (result) {
                if (!result) throw "Something went wrong!"
                const data = { ...options.StoreData, stellarToken: result.paging_token }

                const neewTransaction = await Transaction.findOne({ transactionId: data.transactionId });
                console.log("here in 55", data, neewTransaction);
                if (!neewTransaction) {

                    await Transaction.create(data);
                } else {
                    const value = await Transaction.findOneAndUpdate({ transactionId: neewTransaction.transactionId }, data, { upsert: true, new: true },);
                    console.log(value, "value")
                }
                return result;
            })
            .catch(async function (error) {
                console.error("Something went wrong!", error);
                // console.error(
                //     "Something went wrong!",
                //     error.response.data.extras
                // );
                if (error) {
                    // await addMoney(options)
                }
            });
    } catch (error) {
        throw error;
    }
};

const fundTransfer = async (options) => {
    let from_secret = options.gaverSecretKey || 'SCEUUIDEITQD5MCU3SDLUQYD3WDN5LAQKN2ULMIWQ2MJLJ53OAJHFIGV',
        from_public = options.gaverPublicKey || 'GB2WH6X46RNUGCXSHI7YHIRWVFNPQNZDYKMGO4YEDKRSO5UZQMHSCNVG',
        to_account = options.reciverKey,
        amount = options.total;

    try {
        let sourceKeys = StellarSdk.Keypair.fromSecret(from_secret);
        if (!to_account) {
            const { publicKey, secretKey } = generateStellarKey();
            let ac_keypair = StellarSdk.Keypair.fromSecret(secretKey);
            const response = await axios.get(
                `https://friendbot.stellar.org?addr=${encodeURIComponent(
                    ac_keypair.publicKey(),
                )}`,
            );
            to_account = publicKey
        }
        console.log(from_public, from_secret, to_account, amount)
        return await server
            .loadAccount(to_account)
            .catch(function (error) {
                if (error instanceof StellarSdk.NotFoundError) {
                    throw new Error("The destination account does not exist!");
                } else return error;
            })
            .then(function () {
                return server.loadAccount(from_public);
            })
            .then(async function (sourceAccount) {
                if (sourceAccount) {
                    if (parseFloat(sourceAccount.balances[0].balance) < parseFloat(amount)) {
                        throw new Error("User account have Insufficient funds!");
                    } else {
                        let newTransaction = new StellarSdk.TransactionBuilder(
                            sourceAccount,
                            {
                                fee: StellarSdk.BASE_FEE,
                                networkPassphrase: StellarSdk.Networks.TESTNET,
                            }
                        )
                            .addOperation(
                                StellarSdk.Operation.payment({
                                    destination: to_account,
                                    asset: StellarSdk.Asset.native(),
                                    amount: amount + "",
                                })
                            )
                            .addMemo(StellarSdk.Memo.text(""))
                            // .setTimeout(180)
                            .build();
                        newTransaction.sign(sourceKeys);
                        let transactionData = await server.submitTransaction(newTransaction);
                        return { ...transactionData, to_account, }
                    }
                }


            })
            .then(async function (result) {
                if (!result) throw "Something went wrong!"

                return result;
            })
            .catch(async function (error) {
                console.error("Something went wrong!", error);

            });
    } catch (error) {
        throw error;
    }
};


module.exports = {
    creditAccount: creditAccount,
    creditAccountNew: creditAccountNew,
    fundTransfer: fundTransfer

};
