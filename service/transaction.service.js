const User = require("../models/Users");
const Merchant = require("../models/merchant");
const Transaction = require("../models/Transaction");
const userService = require("./user.service");
const stellar = require("./stellar");
const msgService = require("./poynt/sendMessage");
const emailService = require('./email.service')

const createTransaction = async (data) => {
    console.log("createTransaction in Transaction Service Page")
    try {
        let transactionId = data.id || "",
            employeeUserId = data.context.employeeUserId || "",
            storeDeviceId = data.context.storeDeviceId || "",
            businessId = data.context.businessId || "",
            storeId = data.context.storeId || "",
            customerLanguage = data.customerLanguage || "",
            customerOptedNoTip = data.amounts.customerOptedNoTip || "",
            currency = data.amounts.currency || "",
            tipAmount = data.amounts.tipAmount || "",
            transactionAmount = data.amounts.transactionAmount || "",
            orderAmount = data.amounts.orderAmount || "",
            status = data.processorResponse.status || "",
            customerUserId = data.customerUserId || "",
            cardId = data.fundingSource.card.cardId || "",
            cardHolderFirstName =
                data.fundingSource.card.cardHolderFirstName || "",
            cardHolderLastName =
                data.fundingSource.card.cardHolderLastName || "",
            cardNumber = data.fundingSource.card.numberMasked || "",
            createdAt = data.createdAt || "",
            updatedAt = data.updatedAt || "";
        const merchant = await Merchant.findOne({ businessId });
        const userData = {
            customerUserId,
            cardId,
            cardHolderFirstName,
            cardHolderLastName,
            cardNumber,
            email: new Date() + '@gmail.com',
            password: "Test@123",
            phoneNumberCall: null,
            phoneNumberSMS: null,
        };
        console.log(userData);
        await userService.createUser(userData, userData.password);
        // console.log("in transaction service", data);


        const userDetail = await Merchant.findOne({
            email: userData.email,
        });
        let StoreData = {
            merchantId: merchant._id || null,
            userId: userDetail._id || null,
            transactionId,
            employeeUserId,
            storeDeviceId,
            businessId,
            storeId,
            customerLanguage,
            customerOptedNoTip,
            currency,
            tipAmount,
            transactionAmount,
            orderAmount,
            status,
            customerUserId,
            cardId,
            cardHolderFirstName,
            cardHolderLastName,
            cardNumber,
            createdAt,
            updatedAt,
        };
        // console.log("in transaction userDetail",userDetail)
        const options = {
            userDetail,
            StoreData,
            merchant,
            asset: "native",
            amount: transactionAmount,
        };
        const stellarData = await stellar.userCredit.creditAccount(options);
        console.log("new stellar Data", stellarData);
        // await Transaction.create(StoreData);
        //    await msgService.deviceMessage(merchant, StoreData);
        return 'success'
    } catch (error) {
        console.log(error);
        return error
    }
};

const createTransactionNew = async (merchant, data) => {
    console.log("createTransaction in Transaction Service Page")
    try {
        let transactionId = data.transactionId || null,
            employeeUserId = data.employeeUserId || null,
            storeDeviceId = data.storeDeviceId || null,
            businessId = data.businessId || null,
            storeId = data.storeId || null,
            customerLanguage = data.customerLanguage || null,
            customerOptedNoTip = data.customerOptedNoTip || null,
            currency = data.currency || null,
            tipAmount = data.tipAmount || null,
            transactionAmount = data.transactionAmount || 10,
            orderAmount = data.orderAmount || 10,
            status = data.status || null,
            customerUserId = data.customerUserId || Date.now(),
            cardId = data.cardId || null,
            cardHolderFirstName =
                data.cardHolderFirstName || null,
            cardHolderLastName =
                data.cardHolderLastName || null,
            cardNumber = data.numberMasked || null,
            createdAt = data.createdAt || null,
            updatedAt = data.updatedAt || null;
        // const merchant = await Merchant.findOne({ businessId });
        const userData = {
            customerUserId,
            cardId,
            cardHolderFirstName,
            cardHolderLastName,
            cardNumber,
            email: cardNumber + '@gmail.com',
            password: "Test@123",
            phoneNumberCall: null,
            phoneNumberSMS: null,
        };
        const userServiceResponse = await userService.createUser(userData, userData.password);
        // console.log("in transaction service", data);
        console.log(userServiceResponse)
        if (userServiceResponse) {
            const userDetail = await Merchant.findOne({
                email: userData.email,
            });
            let StoreData = {
                merchantId: merchant._id || null,
                userId: userDetail._id || null,
                transactionId,
                employeeUserId,
                storeDeviceId,
                businessId,
                storeId,
                customerLanguage,
                customerOptedNoTip,
                currency,
                tipAmount,
                transactionAmount,
                orderAmount,
                status,
                customerUserId,
                cardId,
                cardHolderFirstName,
                cardHolderLastName,
                cardNumber,
                createdAt,
                updatedAt,
            };
            // console.log("in transaction userDetail",userDetail)
            const options = {
                userDetail,
                StoreData,
                merchant,
                asset: "native",
                amount: transactionAmount,
            };
            const stellarData = await stellar.userCredit.creditAccount(options);
            if (stellarData) {
                return stellarData
            } else {
                throw 'Stellar account error'
            }
        } else {
            throw 'Something went wrong'
        }

    } catch (error) {
        console.log(error);
        return error
    }
};

const createTransactionNew2 = async (merchant, data) => {
    console.log("createTransaction in Transaction Service Page")
    try {
        let transactionId = data.transactionId || null,
            employeeUserId = data.employeeUserId || null,
            storeDeviceId = data.storeDeviceId || null,
            businessId = data.businessId || null,
            storeId = data.storeId || null,
            customerLanguage = data.customerLanguage || null,
            customerOptedNoTip = data.customerOptedNoTip || null,
            transactionType = data.transactionType || 0,
            currency = data.currency || null,
            tipAmount = data.tipAmount || null,
            transactionAmount = data.transactionAmount || 10,
            orderAmount = data.orderAmount || 10,
            status = data.status || null,
            customerUserId = data.customerUserId || Date.now(),
            cardId = data.cardId || null,
            cardHolderFirstName =
                data.cardHolderFirstName || null,
            cardHolderLastName =
                data.cardHolderLastName || null,
            cardNumber = data.cardNumber || null,
            createdAt = data.createdAt || null,
            updatedAt = data.updatedAt || null;
        const merchant = await Merchant.findOne({ businessId });
        const userData = {
            customerUserId,
            cardId,
            cardHolderFirstName,
            cardHolderLastName,
            cardNumber,
            email: cardNumber + '@gmail.com',
            password: "Test@123",
            phoneNumberCall: null,
            phoneNumberSMS: null,
        };
        const userServiceResponse = await userService.createUser(userData, userData.password);
        // console.log("in transaction service", data);
        console.log(userServiceResponse)
        if (userServiceResponse) {
            const userDetail = await Merchant.findOne({
                email: userData.email,
            });

            let StoreData = {
                merchantId: merchant._id || null,
                userId: userDetail._id || null,
                transactionId,
                employeeUserId,
                storeDeviceId,
                businessId,
                storeId,
                customerLanguage,
                transactionType,
                customerOptedNoTip,
                currency,
                tipAmount,
                transactionAmount,
                orderAmount,
                status,
                customerUserId,
                cardId,
                cardHolderFirstName,
                cardHolderLastName,
                cardNumber,
                createdAt,
                updatedAt,
            };
            // console.log("in transaction userDetail",userDetail)
            const options = {
                userDetail,
                StoreData,
                merchant,
                asset: "native",
                amount: transactionAmount,
            };
            if (transactionType == 1) {
                const neewTransaction = await Transaction.findOne({ transactionId });
                if (!neewTransaction) await Transaction.create(StoreData);
                return await Transaction.findOne(StoreData);
            } else {
                const stellarData = await stellar.userCredit.creditAccountNew(options);
                if (stellarData) {
                    const data = { ...StoreData, stellarToken: stellarData.paging_token }
                    const neewTransaction = await Transaction.findOne({ transactionId: data.transactionId });
                    if (!neewTransaction) await Transaction.create(data);

                    const merchantDetail = await Merchant.findById(data.merchantId);
                    if (merchantDetail) {
                        console.log(merchantDetail);
                        await emailService.sendTransactionCompleteMerchant(
                            merchantDetail.email,
                            options.merchant,
                            merchantDetail.publicKey,
                            new Date()
                        );
                    }
                    return await Transaction.findOne({ transactionId: data.transactionId });
                } else {
                    throw 'Stellar account error'
                }
            }

        } else {
            throw 'Something went wrong'
        }

    } catch (error) {
        console.log(error);
        return error
    }
};

const createTransactionNew3 = async (merchant, data) => {
    console.log("createTransaction in Transaction Service Page");
    try {
        let { transactionId = null, employeeUserId = null, storeDeviceId = null, businessId = null, storeId = null, customerLanguage = null, customerOptedNoTip = null, transactionType = 0, currency = null, tipAmount = 0, transactionAmount = 0, orderAmount = 0, status = null, customerUserId = new Date(), cardId = null, cardHolderFirstName = null, cardHolderLastName = null, cardNumber = null, createdAt = null, updatedAt = null } = data;

        const userData = {
            customerUserId,
            cardId,
            cardHolderFirstName,
            cardHolderLastName,
            cardNumber,
            email: new Date() + '@gmail.com',
            password: "Test@123",
            phoneNumberCall: null,
            phoneNumberSMS: null,
        };
        const userServiceResponse = await userService.createUser(userData, userData.password);
        // console.log("in transaction service", data);
        console.log(userServiceResponse)
        if (userServiceResponse) {
            // const userDetail = await Merchant.findOne({
            //     email: userData.email,
            // });

            let StoreData = {
                merchantId: merchant._id || null,
                userId: userServiceResponse._id || null,
                transactionId,
                employeeUserId,
                storeDeviceId,
                businessId,
                storeId,
                customerLanguage,
                transactionType,
                customerOptedNoTip,
                currency,
                tipAmount,
                transactionAmount,
                orderAmount,
                status,
                customerUserId,
                cardId,
                cardHolderFirstName,
                cardHolderLastName,
                cardNumber,
                createdAt,
                updatedAt,
            };
            console.log("in transaction userDetail", userServiceResponse)
            const options = {
                userDetail: userServiceResponse,
                StoreData,
                merchant,
                asset: "native",
                amount: transactionAmount,
            };
            // if (transactionType == 1) {
            //     const neewTransaction = await Transaction.findOne({ transactionId });
            //     if (!neewTransaction) await Transaction.create(StoreData);
            //     return await Transaction.findOne(StoreData);
            // } else {
            const stellarData = await stellar.userCredit.creditAccountNew(options);
            // if (stellarData) {
            const data = { ...StoreData, stellarToken: stellarData.paging_token }
            const neewTransaction = await Transaction.findOne({ transactionId: data.transactionId });
            if (!neewTransaction) await Transaction.create(data);

            // const merchantDetail = await Merchant.findById(data.merchantId);

            return await Transaction.findOne({ transactionId: data.transactionId });
            //     if (merchantDetail) {
            // console.log(merchantDetail);
            // await emailService.sendTransactionCompleteMerchant(
            //     merchantDetail.email,
            //     options.merchant,
            //     merchantDetail.publicKey,
            //     new Date()
            // );
            // }

            // } else {
            //     throw 'Stellar account error'
            // }
            // } else {
            //     throw 'Steller Account may have less balance'
            // }

        } else {
            throw 'Something went wrong'
        }

    } catch (error) {
        console.log(error);
        return error
    }
};

const transactionApi = async (data) => {
    try {
        return await stellar.userCredit.fundTransfer(data);
    } catch (error) {
        console.log(error);
        return error
    }
}

module.exports = {
    createTransaction, createTransactionNew, createTransactionNew2, createTransactionNew3, transactionApi
};
