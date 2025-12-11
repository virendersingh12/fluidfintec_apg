const { dirname } = require("path");
const debug = require("debug");
const transactionService = require("../service/transaction.service");
const Transaction = require("../models/Transaction");
const Merchant = require("../models/merchant");

var minus_minutes = function (dt, minutes) {
    return new Date(dt.getTime() - minutes * 60000);
};

const createHookBusiness = async (req, res) => {
    try {
        let merchant, Urls;
        if (req.user) {
            merchant = await Merchant.findOne({ _id: req.user._id });
        }
        if (req.body.url) {
            Urls = req.body.url;
        }
        let poynt = require("poynt")({
            applicationId:
                merchant.applicationId ||
                "urn:aid:5998f34f-576d-40ff-8550-be776022bcef",
            filename: dirname(require.main.filename) + "/key.pem",
        });
        poynt.createHook(
            {
                businessId:
                    merchant.businessId ||
                    "3549d1c4-65c7-4348-a1e0-64eba63fa5d0",
                eventTypes: [
                    "TRANSACTION_AUTHORIZED",
                    "TRANSACTION_CAPTURED",
                    "TRANSACTION_REFUNDED",
                    "TRANSACTION_UPDATED",
                    "TRANSACTION_VOIDED",
                ],
                deliveryUrl:
                    Urls ||
                    "https://staging.api.fluidfintec.com/api/webhook/webhookCall",
                secret: req.body.secret || "",
            },
            function (err, doc) {
                if (err) {
                    throw err;
                }
                console.log(doc);
                return res.status(200).send({ message: "success", data: doc });
            }
        );
    } catch (e) {
        console.log(e);
        return res
            .status(400)
            .send({ message: e.msg || "Something went wrong..." });
    }
};

const getHookBusiness = async (req, res) => {
    try {
        // const merchant = await Merchant.findOne({ _id: req.user._id })
        let poynt = require("poynt")({
            applicationId: "urn:aid:5998f34f-576d-40ff-8550-be776022bcef",
            filename: dirname(require.main.filename) + "/key.pem",
        });
        poynt.getHooks(
            {
                businessId: "3549d1c4-65c7-4348-a1e0-64eba63fa5d0",
            },
            function (err, doc) {
                if (err) {
                    throw err;
                }
                return res.status(200).send({ data: doc });
            }
        );
    } catch (e) {
        console.log(e);
        return res
            .status(400)
            .send({ message: e.msg || "Something went wrong..." });
    }
};

const deleteHookBusiness = async (req, res) => {
    try {
        const merchant = await Merchant.findOne({ _id: req.user._id });
        let poynt = require("poynt")({
            applicationId:
                merchant.applicationId ||
                "urn:aid:5998f34f-576d-40ff-8550-be776022bcef",
            filename: dirname(require.main.filename) + "/key.pem",
        });
        poynt.deleteHook(
            {
                hookId:
                    req.body.hookId || "39a91318-836a-48b6-a981-0c7b863b8706",
            },
            function (err, doc) {
                if (err) {
                    throw err;
                }
                return res.status(200).send({ data: doc });
            }
        );
    } catch (e) {
        console.log(e);
        return res
            .status(400)
            .send({ message: e.msg || "Something went Wrong" });
    }
};

const getTransactionPoynt = async (req, res) => {
    console.log("webhook Call", req.body);
    try {
        let poynt = require("poynt")({
            applicationId: "urn:aid:5998f34f-576d-40ff-8550-be776022bcef",
            filename: dirname(require.main.filename) + "/key.pem",
        });
        const time = new Date();
        let currentTime = time.toISOString();
        // console.log(time)
        let startTime = await minus_minutes(time, 55);
        // console.log(startTime)
        poynt.getTransactions(
            {
                businessId: "3549d1c4-65c7-4348-a1e0-64eba63fa5d0",
                // startAt: startTime.toISOString(),
                endAt: currentTime,
            },
            async function (err, doc) {
                try {
                    if (err) {
                        throw err;
                    } else {
                        // console.log(JSON.stringify(doc));
                        let data = [];
                        data = doc.transactions;
                        if (data.length) {
                            let filterData = data.filter(function (el) {
                                return el.action == "CAPTURE";
                            });
                            if (filterData.length) {
                                for (let i = 0; i < filterData.length; i++) {
                                    const data = await Transaction.findOne({
                                        transactionId: filterData[i].id,
                                    });
                                    if (!data) {
                                        await transactionService.createTransaction(
                                            filterData[i]
                                        );
                                    }
                                }
                                return res
                                    .status(200)
                                    .send({ data: "success" });
                            } else {
                                console.log("No Any data to fetch");
                                return res
                                    .status(200)
                                    .send({ data: "success" });
                            }
                        } else {
                            console.log("No Any data to fetch");
                            return res.status(200).send({ data: "success" });
                        }
                    }
                } catch (e) {
                    console.log(e);
                    return res.status(400).send({ data: "false" });
                }
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: "false" });
    }
};

const getTransactionPoynt2 = (req, res) => {
    console.log("webhook2 Call", req.body);
    try {
        return res.status(200).send({ data: "success" });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: "false" });
    }
};

const successAPI = async (req, res) => {
    const { body = {} } = req;

    console.log("webhook2 Call", req.body);
    try {
        if (body.businessId && body.transactionId) {
            const merchant = await Merchant.findOne({
                businessId: body.businessId,
            });
            if (merchant) {
                var poynt = require("poynt")({
                    applicationId: merchant.applicationId,
                    key: merchant.applicationIdkey,
                });
                poynt.getTransaction(
                    {
                        businessId: body.businessId,
                        transactionId: body.transactionId,
                    },
                    async function (err, doc) {
                        if (err) {
                            throw err;
                        }
                        const data = await Transaction.findOne({
                            transactionId: doc.id,
                        }).select(
                            "transactionId stellarToken transactionAmount status customerUserId createdAt"
                        );
                       
                        if (!data) {
                            await transactionService.createTransaction(doc);
                            const userData = await Merchant.findOne({
                                businessId: body.businessId,
                            }).select("publicKey");
                            const saveTransaction = await Transaction.findOne({
                                transactionId: doc.id,
                            }).select(
                                "transactionId stellarToken transactionAmount status customerUserId createdAt"
                            );
                            return res
                                .status(200)
                                .send({
                                    data: {...saveTransaction.toJSON(), merchantPublicKey:merchant.publicKey, userPublicKey :userData.publicKey},
                                    message: "Success",
                                });
                        } else {
                            const userData = await Merchant.findOne({
                                businessId: body.businessId,
                            }).select("publicKey");
                            return res
                                .status(400)
                                .send({
                                    data:{...data.toJSON(), merchantPublicKey:merchant.publicKey, userPublicKey :userData.publicKey},
                                    message: "Transaction already available",
                                });
                        }
                    }
                );
            }
        } else {
            return res.status(400).send({ data: null, message: "false" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: "false" });
    }
};

module.exports = {
    getTransactionPoynt,
    getTransactionPoynt2,
    createHookBusiness,
    getHookBusiness,
    deleteHookBusiness,
    successAPI,
};
