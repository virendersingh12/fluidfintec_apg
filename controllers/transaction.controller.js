const { dirname } = require("path");
const MerchantStellarTransaction = require("../models/merchantStellarTransaction");
const Transaction = require("../models/Transaction");
const Merchant = require("../models/merchant");
const mongoose = require("mongoose");
const User = require("../models/Users");
const debug = require("debug");
const stellar = require("../service/stellar");
const transactionService = require("../service/transaction.service");
const productService = require('../service/product.services')
const emailService = require("../service/email.service");
const Product = require("../models/products");
// const stellar = require('../service/stellar/index')
const {
    generateStellarKey
} = require("../helpers/apiKeyFuncs");

const getTransaction = async (req, res) => {
    const { params = {} } = req;
    const { hash } = params;
    try {
        const transaction = await MerchantStellarTransaction.find({
            txId: hash,
        });
        console.log("GET TRANSACTION DATA", transaction);
        return res.status(200).send(transaction);
    } catch (err) {
        console.log("GET TRANSACTION ERROR", err);
        res.status(400).send({ message: "An error occurred." });
    }
};

const getTransactionPoynt = async (req, res) => {
    console.log(req.user.role, req.params, req.query, req.body, "console1");
    const { publicKey } = req.body;

    try {
        console.log(publicKey, "publickey")
        let merchant;
        if (publicKey) {
            merchant = await Merchant.findOne({ publicKey });
        } else {
            merchant = await Merchant.findById(req.user._id);
        }
        console.log(merchant, 'console2');
        const modelTransaction = await Transaction.find({
            merchantId: merchant._id,
        }).sort({
            createdAt: -1,
        });
        console.log(modelTransaction);
        if (modelTransaction) {
            return res
                .status(200)
                .send({ data: modelTransaction, user: req.user });
        } else {
            return res.status(400).send({ message: "An error occurred." });
        }

    } catch (error) {
        console.log(error);
    }


    // if (req.user.role == "Admin" || req.user.role == "SuperAdmin") {
    //     console.log("here", req.user.role);
    //     try {
    //         const modelTransaction = await Transaction.find().sort({
    //             createdAt: -1,
    //         });
    //         console.log(modelTransaction);
    //         if (modelTransaction) {
    //             return res
    //                 .status(200)
    //                 .send({ data: modelTransaction, user: req.user });
    //         } else {
    //             return res.status(400).send({ message: "An error occurred." });
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // } else if (req.user.role == "Merchant") {
    //     try {
    //         if (req.user) {
    //             const modelTransaction = await Transaction.find({
    //                 merchantId: req.user._id,
    //             }).sort({ createdAt: -1 });
    //             console.log("here 41", modelTransaction);
    //             if (modelTransaction && modelTransaction.length && modelTransaction[0].merchantId == req.user._id) {
    //                 return res
    //                     .status(200)
    //                     .send({ data: modelTransaction, user: req.user });
    //             } else {
    //                 return res
    //                     .status(400)
    //                     .send({ message: "An error occurred." });
    //             }
    //         } else {
    //             throw "BusinessId not defined";
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         return res
    //             .status(400)
    //             .send({ message: error || "An error occurred." });
    //     }
    // } else {
    //     try {
    //         if (req.user.role == "User") {
    //             const modelTransaction = await Transaction.find({
    //                 userId: req.user._id,
    //             }).sort({ createdAt: -1 });
    //             return res
    //                 .status(200)
    //                 .send({ data: modelTransaction, user: req.user });
    //         } else {
    //             throw "BusinessId not defined";
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         return res
    //             .status(400)
    //             .send({ message: error || "An error occurred." });
    //     }
    // }
};

const getTransactionPoyntByid = async (req, res) => {
    console.log(req.user.role);
    const id = req.params;
    try {
        const modelTransaction = await Transaction.find({
            transactionId: req.params.id,
        });
        if (modelTransaction[0].paymentProcessorType == 'Worldnet') {
            var merchantDetail = await Merchant.find({
                businessId: modelTransaction[1].businessId,
            });
        } else {
            var merchantDetail = await Merchant.find({
                businessId: modelTransaction[0].businessId,
            });

        }

        const userDetail = await Merchant.find({
            _id: modelTransaction[0].userId,
        });

        if (
            id &&
            modelTransaction &&
            merchantDetail &&
            userDetail
        ) {
            if (modelTransaction[0].transactionType == 1) {
                const products = await Product.find({ transactionId: req.params.id })
                return res.status(200).send({
                    data: modelTransaction,
                    user: userDetail,
                    products,
                    merchant: merchantDetail,
                });
            } else {
                if (modelTransaction[0].paymentProcessorType == 'Worldnet') {
                    return res.status(200).send({
                        data: modelTransaction,
                        user: [],
                        merchant: merchantDetail,
                    });
                } else {
                    return res.status(200).send({
                        data: modelTransaction,
                        user: userDetail,
                        merchant: merchantDetail,
                    });
                }

            }
        } else {
            return res.status(400).send({
                data: "Sorry you are not eligible to see data.",
            });
        }
    } catch (err) {
        return res.status(400).send({
            data: "Sorry you are not eligible to see data.",
        });
    }
};

const getTransactionWithPagination = async (req, res) => {
    console.log(req.user);

    try {
        //    const totalTransaction= await Transaction.countDocuments();
        const options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            sort: { createdAt: -1 },
            collation: {
                locale: "en",
            },
        };
        const data = await Transaction.paginate({}, options);
        let transactionDetails = [];
        console.log(data.docs.length);
        for (let i = 0; i < data.docs.length; i++) {
            const merchant = await Merchant.findOne({
                businessId: data.docs[i].businessId,
            }).select("email contactName publicKey");
            console.log(merchant);
            let transaction = data.docs[i];
            if (merchant) {
                transactionDetails.push({
                    ...transaction.toJSON(),
                    email: merchant.email,
                    contactName: merchant.contactName,
                    publicKey: merchant.publicKey,
                });
            }
        }
        console.log(transactionDetails);
        res.status(200).json({
            user: req.user,
            data: transactionDetails,
            totalDocs: data.totalDocs,
            limit: data.limit,
            page: data.page,
            totalPages: data.totalPages,
            hasNextPage: data.hasNextPage,
            nextPage: data.nextPage,
            hasPrevPage: data.hasPrevPage,
            prevPage: data.prevPage,
            pagingCounter: data.pagingCounter,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
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
            console.log(merchant);
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
                            let createTransaction =
                                await transactionService.createTransaction(doc);
                            if (createTransaction) {
                                const userData = await Merchant.findOne({
                                    businessId: body.businessId,
                                }).select("publicKey");
                                const saveTransaction =
                                    await Transaction.findOne({
                                        transactionId: doc.id,
                                    }).select(
                                        "transactionId stellarToken transactionAmount status customerUserId createdAt"
                                    );
                                if (saveTransaction) {
                                    return res.status(200).send({
                                        data: {
                                            ...saveTransaction.toJSON(),
                                            merchantPublicKey:
                                                merchant.publicKey,
                                            userPublicKey: userData.publicKey,
                                        },
                                        message: "Success",
                                    });
                                } else {
                                    return res
                                        .status(400)
                                        .send({ data: null, message: "false" });
                                }
                            }
                        } else {
                            const userData = await Merchant.findOne({
                                businessId: body.businessId,
                            }).select("publicKey");
                            return res.status(400).send({
                                data: {
                                    ...data.toJSON(),
                                    merchantPublicKey: merchant.publicKey,
                                    userPublicKey: userData.publicKey,
                                },
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

const successAPINew = async (req, res) => {
    const { body = {} } = req;

    try {
        const merchant = await Merchant.findOne({
            businessId: body.businessId,
        });
        if (!merchant) throw 'Merchant not found';
        const data = await Transaction.findOne({
            transactionId: body.transactionId,
        }).select(
            "transactionId stellarToken transactionAmount status customerUserId createdAt"
        );
        if (data) {
            const userData = await Merchant.findOne({
                businessId: body.businessId,
            }).select("publicKey");
            return res.status(400).send({
                data: {
                    ...data.toJSON(),
                    merchantPublicKey: merchant.publicKey,
                    userPublicKey: userData.publicKey,
                },
                message: "Transaction already available",
            });
        } else {
            const transaction = await transactionService.createTransactionNew(merchant, body);
            console.log(transaction, "transaction")
            if (transaction) {
                const userData = await Merchant.findOne({
                    businessId: body.businessId
                }).select("publicKey");
                console.log('UserData', userData)
                const saveTransaction =
                    await Transaction.findOne({
                        transactionId: body.transactionId,
                    }).select(
                        "transactionId stellarToken transactionAmount status customerUserId createdAt"
                    );
                console.log(saveTransaction, 'saveTransaction')
                if (saveTransaction) {
                    return res.status(200).json({
                        data: {
                            ...saveTransaction.toJSON(),
                            merchantPublicKey:
                                merchant.publicKey,
                            userPublicKey: userData.publicKey,
                        },
                        message: "Success",
                    });
                } else {
                    return res
                        .status(400)
                        .send({ data: null, message: "false" });

                }
                //    res.status(200).json({ status: 200, data: transaction, message: "Success" })
            }
        }

        // if (body.businessId && body.transactionId) {
        //     const merchant = await Merchant.findOne({
        //         businessId: body.businessId,
        //     });
        //     console.log(merchant);
        //     if (merchant) {
        //         var poynt = require("poynt")({
        //             applicationId: merchant.applicationId,
        //             key: merchant.applicationIdkey,
        //         });
        //         poynt.getTransaction(
        //             {
        //                 businessId: body.businessId,
        //                 transactionId: body.transactionId,
        //             },
        //             async function (err, doc) {
        //                 if (err) {
        //                     throw err;
        //                 }
        //                 const data = await Transaction.findOne({
        //                     transactionId: doc.id,
        //                 }).select(
        //                     "transactionId stellarToken transactionAmount status customerUserId createdAt"
        //                 );

        //                 if (!data) {
        //                     let createTransaction =
        //                         await transactionService.createTransaction(doc);
        //                     if (createTransaction) {
        //                         const userData = await Merchant.findOne({
        //                             businessId: body.businessId,
        //                         }).select("publicKey");
        //                         const saveTransaction =
        //                             await Transaction.findOne({
        //                                 transactionId: doc.id,
        //                             }).select(
        //                                 "transactionId stellarToken transactionAmount status customerUserId createdAt"
        //                             );
        //                         if (saveTransaction) {
        //                             return res.status(200).send({
        //                                 data: {
        //                                     ...saveTransaction.toJSON(),
        //                                     merchantPublicKey:
        //                                         merchant.publicKey,
        //                                     userPublicKey: userData.publicKey,
        //                                 },
        //                                 message: "Success",
        //                             });
        //                         } else {
        //                             return res
        //                                 .status(400)
        //                                 .send({ data: null, message: "false" });
        //                         }
        //                     }
        //                 } else {
        //                     const userData = await Merchant.findOne({
        //                         businessId: body.businessId,
        //                     }).select("publicKey");
        //                     return res.status(400).send({
        //                         data: {
        //                             ...data.toJSON(),
        //                             merchantPublicKey: merchant.publicKey,
        //                             userPublicKey: userData.publicKey,
        //                         },
        //                         message: "Transaction already available",
        //                     });
        //                 }
        //             }
        //         );
        //     }
        // } else {
        //     return res.status(400).send({ data: null, message: "false" });
        // }
    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: "false" });
    }
};

const successAPINew2 = async (req, res) => {
    const { body = {} } = req;

    try {
        const merchant = await Merchant.findOne({
            businessId: body.businessId,
        });
        if (!merchant) throw 'Merchant not found';
        const data = await Transaction.findOne({
            transactionId: body.transactionId,
        }).select(
            "transactionId stellarToken transactionAmount status customerUserId createdAt"
        );
        if (data) {
            const userData = await Merchant.findOne({
                businessId: body.businessId,
            }).select("publicKey");
            return res.status(400).send({
                data: {
                    ...data.toJSON(),
                    merchantPublicKey: merchant.publicKey,
                    userPublicKey: userData.publicKey,
                },
                message: "Transaction already available",
            });
        } else {
            const transaction = await transactionService.createTransactionNew2(merchant, body);
            console.log(transaction, "transaction")
            if (transaction) {
                const userData = await Merchant.findOne({
                    businessId: body.businessId
                }).select("publicKey");
                console.log('UserData', userData)
                const saveTransaction =
                    await Transaction.findOne({
                        transactionId: body.transactionId,
                    }).select(
                        "transactionId stellarToken transactionAmount status customerUserId createdAt"
                    );
                console.log(saveTransaction, 'saveTransaction')
                if (saveTransaction) {
                    return res.status(200).json({
                        data: {
                            ...saveTransaction.toJSON(),
                            merchantPublicKey:
                                merchant.publicKey,
                            userPublicKey: userData.publicKey,
                        },
                        message: "Success",
                    });
                } else {
                    return res
                        .status(400)
                        .send({ data: null, message: "false" });

                }
                //    res.status(200).json({ status: 200, data: transaction, message: "Success" })
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: "false" });
    }
};

const successAPINew3 = async (req, res) => {
    const { body = {} } = req;

    try {
        const merchant = await Merchant.findOne({
            businessId: body.businessId,
        });
        if (!merchant) throw 'Merchant not found';
        const data = await Transaction.findOne({
            transactionId: body.transactionId,
        }).select(
            "transactionId stellarToken transactionAmount status customerUserId createdAt"
        );
        if (data) {
            const userData = await Merchant.findOne({
                businessId: body.businessId,
            }).select("publicKey");
            return res.status(400).send({
                data: {
                    ...data.toJSON(),
                    merchantPublicKey: merchant.publicKey,
                    userPublicKey: userData.publicKey,
                },
                message: "Transaction already available",
            });
        } else {
            const transaction = await transactionService.createTransactionNew3(merchant, body);
            console.log(transaction, "transaction")
            if (transaction) {
                const userData = await Merchant.findOne({
                    businessId: body.businessId
                }).select("publicKey");
                console.log('UserData', userData)
                const saveTransaction =
                    await Transaction.findOne({
                        transactionId: body.transactionId,
                    }).select(
                        "transactionId stellarToken transactionAmount status customerUserId createdAt"
                    );
                console.log(saveTransaction, 'saveTransaction')
                if (saveTransaction) {
                    return res.status(200).json({
                        data: {
                            ...saveTransaction.toJSON(),
                            merchantPublicKey:
                                merchant.publicKey,
                            userPublicKey: userData.publicKey,
                        },
                        message: "Success",
                    });
                } else {
                    return res
                        .status(400)
                        .send({ data: null, message: "false" });

                }
                //    res.status(200).json({ status: 200, data: transaction, message: "Success" })
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: "false" });
    }
};


const successAPINew4 = async (req, res) => {
    const { body = {} } = req;
    console.log(body);
    try {
        const merchant = await Merchant.findOne({
            businessId: body.businessId,
        });
        if (!merchant) throw 'Merchant not found';
        const data = await Transaction.findOne({
            transactionId: body.transactionId,
        }).select(
            "transactionId stellarToken transactionAmount status customerUserId createdAt"
        );
        if (data) {
            const userData = await Merchant.findOne({
                businessId: body.businessId,
            }).select("publicKey");
            return res.status(400).send({
                data: {
                    ...data.toJSON(),
                    merchantPublicKey: merchant.publicKey,
                    userPublicKey: userData.publicKey,
                },
                message: "Transaction already available",
            });
        } else {
            const transaction = await transactionService.createTransactionNew3(merchant, body);
            if (req.body.receipt_data) {
                const products = await productService.addProducts(req);
                console.log(transaction, "transaction", products)
            }

            if (transaction) {
                const userData = await Merchant.findOne({
                    businessId: body.businessId
                }).select("publicKey");
                console.log('UserData', userData)
                const saveTransaction =
                    await Transaction.findOne({
                        transactionId: body.transactionId,
                    }).select(
                        "transactionId stellarToken transactionAmount status customerUserId createdAt"
                    );
                console.log(saveTransaction, 'saveTransaction')
                if (saveTransaction) {
                    return res.status(200).json({
                        data: {
                            ...saveTransaction.toJSON(),
                            merchantPublicKey:
                                merchant.publicKey,
                            userPublicKey: userData.publicKey,
                        },
                        message: "Success",
                    });
                } else {
                    return res
                        .status(400)
                        .send({ data: null, message: "false" });

                }
                //    res.status(200).json({ status: 200, data: transaction, message: "Success" })
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: "false" });
    }
};

const successAPINew5 = async (req, res) => {
    const { body = {} } = req;
    console.log(body);
    try {
        const merchant = await Merchant.findOne({
            businessId: body.businessId,
        });
        if (!merchant) throw 'Merchant not found';
        const data = await Transaction.findOne({
            transactionId: body.transactionId,
        }).select(
            "transactionId stellarToken transactionAmount status customerUserId createdAt"
        );
        if (data) {
            const userData = await Merchant.findOne({
                businessId: body.businessId,
            }).select("publicKey");
            return res.status(400).send({
                data: {
                    ...data.toJSON(),
                    merchantPublicKey: merchant.publicKey,
                    userPublicKey: userData.publicKey,
                },
                message: "Transaction already available",
            });
        } else {
            const transaction = await transactionService.createTransactionNew3(merchant, body);
            if (req.body.receipt_data) {
                const products = await productService.addProducts1(req);
                console.log(transaction, "transaction", products)
            }

            if (transaction) {
                const userData = await Merchant.findOne({
                    businessId: body.businessId
                }).select("publicKey");
                console.log('UserData', userData)
                const saveTransaction =
                    await Transaction.findOne({
                        transactionId: body.transactionId,
                    }).select(
                        "transactionId stellarToken transactionAmount status customerUserId createdAt"
                    );
                console.log(saveTransaction, 'saveTransaction')
                if (saveTransaction) {
                    return res.status(200).json({
                        data: {
                            ...saveTransaction.toJSON(),
                            merchantPublicKey:
                                merchant.publicKey,
                            userPublicKey: userData.publicKey,
                        },
                        message: "Success",
                    });
                } else {
                    return res
                        .status(400)
                        .send({ data: null, message: "false" });

                }
                //    res.status(200).json({ status: 200, data: transaction, message: "Success" })
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: "false" });
    }
};

const transerfund = async (req, res) => {
    try {
        console.log(req.body)
        const data = await transactionService.transactionApi(req.body);
        return res.status(200).json({
            data,
            message: "Success",
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: "false" });
    }
}

const sendUserEmail = async (req, res) => {
    const { body = {} } = req;

    console.log("send userEmail Call", req.body);
    try {
        if (body.userEmailId && body.transactionId) {
            const transaction = await Transaction.findOne({
                transactionId: body.transactionId,
            });
            console.log(transaction);
            if (!transaction) throw 'Transaction not found'
            const oldUserDetail = await Merchant.findById(transaction.userId);
            console.log(oldUserDetail);
            if (oldUserDetail && oldUserDetail.email != body.userEmailId) {
                const bodyEmail = await Merchant.findOne(
                    { email: body.userEmailId }
                );
                if (!bodyEmail) {
                    await Merchant.findOneAndUpdate(
                        { email: oldUserDetail.email },
                        { email: body.userEmailId }
                    );
                }
                const userDetail = await Merchant.findOne({ email: body.userEmailId })
                console.log(userDetail);
                let StoreData = {
                    merchantId: oldUserDetail._id || null,
                    userId: userDetail._id || null,
                    ...transaction.toJSON(),
                };
                console.log("in transaction StoreData", StoreData);
                const options = {
                    userDetail,
                    StoreData,
                    merchant: oldUserDetail,
                    asset: "native",
                    amount: transaction.transactionAmount,
                };
                const stellarData = await stellar.userCredit.creditAccount(
                    options
                );
                if (stellarData) {
                    await Transaction.findOneAndUpdate(
                        { transactionId: body.transactionId },
                        { userId: userDetail._id }
                    );
                    await emailService.sendTransactionCompleteMerchant(
                        body.userEmailId,
                        userDetail,
                        transaction,
                        body.current_time
                    );
                    console.log("complete");
                    return res
                        .status(200)
                        .send({
                            data: null,
                            message: "mail sent successfully",
                        });
                }
            } else {
                console.log(oldUserDetail);

                if (transaction.customerUserId) {
                    await emailService.sendTransactionCompleteMerchant(
                        body.userEmailId,
                        oldUserDetail,
                        transaction,
                        body.current_time
                    );
                    console.log("complete");
                    return res
                        .status(200)
                        .send({
                            data: null,
                            message: "mail sent successfully",
                        });
                } else {
                    return res
                        .status(400)
                        .send({ data: null, message: "false" });
                }
            }
        } else {
            return res.status(400).send({ data: null, message: "false" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: "false", message: error });
    }
};



const sendUserEmailNew = async (req, res) => {
    const { body = {} } = req;

    console.log("send userEmail Call", req.body);
    try {
        if (body.userEmailId && body.transactionId) {
            const transaction = await Transaction.findOne({
                transactionId: body.transactionId,
            });
            if (!transaction) throw 'Transaction not found'
            const oldUserDetail = await Merchant.findById(transaction.userId);
            if (oldUserDetail && oldUserDetail.email != body.userEmailId) {
                const bodyEmail = await Merchant.findOne(
                    { email: body.userEmailId }
                );
                if (!bodyEmail) {
                    await Merchant.findOneAndUpdate(
                        { email: oldUserDetail.email },
                        { email: body.userEmailId },
                        { upsert: true, new: true }
                    );
                }
                const userDetail = await Merchant.findOne({ email: body.userEmailId })
                console.log(userDetail);
                let StoreData = {
                    merchantId: oldUserDetail._id || null,
                    userId: userDetail._id || null,
                    ...transaction.toJSON(),
                };
                console.log("in transaction StoreData", StoreData);
                const options = {
                    userDetail,
                    StoreData,
                    merchant: oldUserDetail,
                    asset: "native",
                    amount: transaction.transactionAmount,
                };
                const stellarData = await stellar.userCredit.creditAccountNew(
                    options
                );
                if (stellarData) {
                    await Transaction.findOneAndUpdate(
                        { transactionId: body.transactionId },
                        { userId: userDetail._id },
                        { upsert: true, new: true }
                    );
                    if (transaction.transactionType == 1) {
                        const products = await Product.find({ transactionId: body.transactionId })
                        await emailService.sendTransactionCompleteMerchantNew(
                            body.userEmailId,
                            userDetail,
                            transaction,
                            body.current_time,
                            products
                        );
                        return res
                            .status(200)
                            .send({
                                data: null,
                                message: "mail sent successfully",
                            });

                    } else {
                        await emailService.sendTransactionCompleteMerchant(
                            body.userEmailId,
                            userDetail,
                            transaction,
                            body.current_time
                        );
                        return res
                            .status(200)
                            .send({
                                data: null,
                                message: "mail sent successfully",
                            });
                    }


                } else {
                    const { publicKey, secretKey } = generateStellarKey();
                    await stellar.accounts.initialiseAccount(secretKey)
                    const users = await Merchant.findOneAndUpdate({ email: body.userEmailId }, { publicKey, secretKey }, { upsert: true, new: true });
                    const options = {
                        userDetail: users,
                        StoreData,
                        merchant: oldUserDetail,
                        asset: "native",
                        amount: transaction.transactionAmount,
                    };
                    const stellarDataNew = await stellar.userCredit.creditAccountNew(
                        options
                    );
                    if (stellarDataNew) {
                        await Transaction.findOneAndUpdate(
                            { transactionId: body.transactionId },
                            { userId: userDetail._id },
                            { upsert: true, new: true }
                        );
                        if (transaction.transactionType == 1) {
                            const products = await Product.find({ transactionId: body.transactionId })
                            await emailService.sendTransactionCompleteMerchantNew(
                                body.userEmailId,
                                userDetail,
                                transaction,
                                body.current_time,
                                products
                            );
                            return res
                                .status(200)
                                .send({
                                    data: null,
                                    message: "mail sent successfully",
                                });

                        } else {
                            await emailService.sendTransactionCompleteMerchant(
                                body.userEmailId,
                                userDetail,
                                transaction,
                                body.current_time
                            );
                            return res
                                .status(200)
                                .send({
                                    data: null,
                                    message: "mail sent successfully",
                                });
                        }


                    }
                }
            } else {
                console.log(oldUserDetail);

                if (transaction.customerUserId) {
                    if (transaction.transactionType == 1) {
                        const product = await Product.find({ transactionId: body.transactionId })
                        await emailService.sendTransactionCompleteMerchantNew(
                            body.userEmailId,
                            oldUserDetail,
                            transaction,
                            body.current_time,
                            product
                        );
                        console.log("complete");
                        return res
                            .status(200)
                            .send({
                                data: null,
                                message: "mail sent successfully",
                            });
                    } else {
                        await emailService.sendTransactionCompleteMerchant(
                            body.userEmailId,
                            oldUserDetail,
                            transaction,
                            body.current_time
                        );
                        console.log("complete");
                        return res
                            .status(200)
                            .send({
                                data: null,
                                message: "mail sent successfully",
                            });
                    }
                } else {
                    return res
                        .status(400)
                        .send({ data: null, message: "false" });
                }
            }
        } else {
            return res.status(400).send({ data: null, message: "false" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: "false", message: error });
    }
};

const sendUserEmailNew1 = async (req, res) => {
    const { body = {} } = req;

    console.log("send userEmail Call", req.body);
    try {
        if (body.userEmailId && body.transactionId) {
            const transaction = await Transaction.findOne({
                transactionId: body.transactionId,
            });
            if (!transaction) throw 'Transaction not found'
            const oldUserDetail = await Merchant.findById(transaction.userId);
            if (oldUserDetail && oldUserDetail.email != body.userEmailId) {
                const bodyEmail = await Merchant.findOne(
                    { email: body.userEmailId }
                );
                if (!bodyEmail) {
                    await Merchant.findOneAndUpdate(
                        { email: oldUserDetail.email },
                        { email: body.userEmailId },
                        { upsert: true, new: true }
                    );
                }
                const userDetail = await Merchant.findOne({ email: body.userEmailId })
                console.log(userDetail);
                let StoreData = {
                    merchantId: oldUserDetail._id || null,
                    userId: userDetail._id || null,
                    ...transaction.toJSON(),
                };
                console.log("in transaction StoreData", StoreData);
                const options = {
                    userDetail,
                    StoreData,
                    merchant: oldUserDetail,
                    asset: "native",
                    amount: transaction.transactionAmount,
                };
                const stellarData = await stellar.userCredit.creditAccountNew(
                    options
                );
                if (stellarData) {
                    await Transaction.findOneAndUpdate(
                        { transactionId: body.transactionId },
                        { userId: userDetail._id },
                        { upsert: true, new: true }
                    );
                    if (transaction.transactionType == 1) {
                        const products = await Product.find({ transactionId: body.transactionId })
                        console.log(products, "products")
                        await emailService.sendTransactionCompleteMerchantNew1(
                            body.userEmailId,
                            userDetail,
                            transaction,
                            body.current_time,
                            products
                        );
                        return res
                            .status(200)
                            .send({
                                data: null,
                                message: "mail sent successfully",
                            });

                    } else {
                        await emailService.sendTransactionCompleteMerchant(
                            body.userEmailId,
                            userDetail,
                            transaction,
                            body.current_time
                        );
                        return res
                            .status(200)
                            .send({
                                data: null,
                                message: "mail sent successfully",
                            });
                    }


                } else {
                    const { publicKey, secretKey } = generateStellarKey();
                    await stellar.accounts.initialiseAccount(secretKey)
                    const users = await Merchant.findOneAndUpdate({ email: body.userEmailId }, { publicKey, secretKey }, { upsert: true, new: true });
                    const options = {
                        userDetail: users,
                        StoreData,
                        merchant: oldUserDetail,
                        asset: "native",
                        amount: transaction.transactionAmount,
                    };
                    const stellarDataNew = await stellar.userCredit.creditAccountNew(
                        options
                    );
                    if (stellarDataNew) {
                        await Transaction.findOneAndUpdate(
                            { transactionId: body.transactionId },
                            { userId: userDetail._id },
                            { upsert: true, new: true }
                        );
                        if (transaction.transactionType == 1) {
                            const products = await Product.find({ transactionId: body.transactionId })
                            console.log(products, "products")
                            await emailService.sendTransactionCompleteMerchantNew1(
                                body.userEmailId,
                                userDetail,
                                transaction,
                                body.current_time,
                                products
                            );
                            return res
                                .status(200)
                                .send({
                                    data: null,
                                    message: "mail sent successfully",
                                });

                        } else {
                            await emailService.sendTransactionCompleteMerchant(
                                body.userEmailId,
                                userDetail,
                                transaction,
                                body.current_time
                            );
                            return res
                                .status(200)
                                .send({
                                    data: null,
                                    message: "mail sent successfully",
                                });
                        }


                    }
                }
            } else {
                console.log(oldUserDetail);

                if (transaction.customerUserId) {
                    if (transaction.transactionType == 1) {
                        const product = await Product.find({ transactionId: body.transactionId })
                        console.log("products", product)
                        await emailService.sendTransactionCompleteMerchantNew1(
                            body.userEmailId,
                            oldUserDetail,
                            transaction,
                            body.current_time,
                            product
                        );
                        console.log("complete");
                        return res
                            .status(200)
                            .send({
                                data: null,
                                message: "mail sent successfully",
                            });
                    } else {
                        await emailService.sendTransactionCompleteMerchant(
                            body.userEmailId,
                            oldUserDetail,
                            transaction,
                            body.current_time
                        );
                        console.log("complete");
                        return res
                            .status(200)
                            .send({
                                data: null,
                                message: "mail sent successfully",
                            });
                    }
                } else {
                    return res
                        .status(400)
                        .send({ data: null, message: "false" });
                }
            }
        } else {
            return res.status(400).send({ data: null, message: "false" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({ data: "false", message: error });
    }
};

module.exports = {
    getTransaction,
    getTransactionPoynt,
    getTransactionPoyntByid,
    getTransactionWithPagination,
    successAPI,
    successAPINew,
    successAPINew2,
    successAPINew3,
    successAPINew4,
    successAPINew5,
    sendUserEmail,
    sendUserEmailNew,
    sendUserEmailNew1,
    transerfund
};
