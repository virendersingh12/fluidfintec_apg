// services/paymentService.js
const axios = require('axios');
const { getAccessToken } = require('../service/token.service');
const config = require('config');
const paymentUrl = config.get('worldnet.paymentUrl');
const Transaction = require('../models/Transaction');
const stellar = require("./stellar");
const msgService = require("./poynt/sendMessage");
const emailService = require('./email.service')
const userService = require("./user.service");
const Merchant = require("../models/merchant");



// const createPayment = async (paymentData) => {
//     const token = await getAccessToken();
//     console.log("hereeeeeeeeeeeeeee", token)

//     const response = await axios.post(
//         `${paymentUrl}`,
//         paymentData,
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//         }
//     );
//     console.log("responseresponseresponse", response.data)

//     const customerAccount = response.data.customerAccount;
//     const orderData = response.data.order;
//     const securityCheck = response.data.securityCheck;
//     const transactionResult = response.data.transactionResult;
//     const [first_name, ...rest] = response.data.customerAccount.cardholderName.trim().split(" ");
//     const last_name = rest.join(" ") || "";
//     // Create and save a transaction in MongoDB
//     const newTransaction = {
//         // type: 'Worldnet',
//         orderId: orderData.orderId,
//         transactionType: 0,
//         transactionId: response.data.uniqueReference,
//         transactionAmount: transactionResult.authorizedAmount,
//         currency: transactionResult.currency,
//         // transactionType: '',
//         status: transactionResult.status,
//         paymentProcessorType: 'Worldnet', // custom value to identify processor
//         worldnetResponse: JSON.stringify(response.data),
//         cardHolderFirstName: first_name,
//         cardHolderLastName: last_name,
//         cardNumber: customerAccount.maskedPan,
//         cardType: customerAccount.cardType,
//         // cardHolderFirstName:"",
//         // cardHolderLastName:"",
//         orderAmount: orderData.totalAmount,
//         // transactionId: data.uniqueReference, // optional
//         // createdAt: new Date(),
//         // updatedAt: new Date()
//     };
//     // console.log("transsssssssssssssss", newTransaction);
//     const worldnet_transaction = await Transaction.create(newTransaction);
//     return response.data;
// };

const createPayment = async (paymentData) => {  //Payment done from POS DEvice and saved in Database
    console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPP", paymentData)
    try {

        // Create and save a transaction in MongoDB

        let cardNum = paymentData.cardNumber.slice(-4)

        // const newTransaction = {
        let orderId = paymentData.orderId,
            businessId = paymentData.businessId || "",
            transactionType = paymentData.type,
            transactionId = paymentData.orderId,
            transactionAmount = paymentData.transactionAmount,
            currency = paymentData.currency,
            customerUserId = Date.now(),
            status = paymentData.status,
            paymentProcessorType = 'Worldnet', // custom value to identify processor
            worldnetResponse = JSON.stringify(paymentData),
            cardHolderFirstName = "POS" || "",
            cardHolderLastName = `-DEVICE-${cardNum}` || "",
            cardNumber = paymentData.cardNumber,
            cardType = paymentData.cardType,
            orderAmount = paymentData.transactionAmount,
            createdAt = paymentData.createdAt,
            updatedAt = paymentData.updatedAt
        cardId = "12345" || ""
        // const merchant = await Merchant.findOne({ businessId: "3549d1c4-65c7-4348-a1e0-64eba63fa5d0" }); FRANK
        // const merchant = await Merchant.findOne({ businessId: "e8b3b726-0f3f-48a5-8f03-3c6ab5f10a93" });  //MH
        // const merchant = await Merchant.findOne({ businessId: "a7f2b5e8-9c31-4d0e-87af-13b9c42e6d5a" });  //ELAN
        const merchant = await Merchant.findOne({
            businessId: paymentData.businessId || paymentData.terminal
        });
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
        console.log("merchantmerchantmerchantmerchantmerchant", merchant);
        await userService.createUser(userData, userData.password);
        // console.log("in transaction service", data);

        const userDetail = await Merchant.findOne({
            // businessId: "3549d1c4-65c7-4348-a1e0-64eba63fa5d0"  FRANK
            // businessId: "e8b3b726-0f3f-48a5-8f03-3c6ab5f10a93"   //MH
            // businessId: "a7f2b5e8-9c31-4d0e-87af-13b9c42e6d5a"   // ELAN
            businessId: paymentData.businessId || paymentData.terminal  // ELAN
        });
        let StoreData = {
            merchantId: paymentData.merchantID || null,
            userId: userDetail._id || null,
            transactionId,
            orderId,
            transactionType,
            businessId,
            currency,
            status,
            cardType,
            paymentProcessorType,
            transactionAmount,
            orderAmount,
            createdAt,
            updatedAt,
        };

        console.log("StoreDataaaaaaaaaaaaaaaaa", StoreData)
        // As per user feedback, trigger Stellar credit transfer
        const options = {
            userDetail,
            StoreData,
            merchant,
            asset: "native",
            amount: transactionAmount,
        };
        console.log("optionsoptionsoptionsoptionsoptionsoptions", options)
        // const stellarData = await stellar.userCredit.creditAccount(options);
        // console.log("new stellar Data", stellarData);
        const newTransaction = {
            // type: 'Worldnet',
            orderId: paymentData.orderId,
            transactionType: 0,
            transactionId: paymentData.orderId,
            transactionAmount: paymentData.transactionAmount,
            currency: paymentData.currency,
            status: paymentData.status,
            paymentProcessorType: 'Worldnet', // custom value to identify processor
            worldnetResponse: JSON.stringify(paymentData.worldnetResponse),
            cardHolderFirstName: "POS",
            cardHolderLastName: "-DEVICE",
            cardNumber: paymentData.cardNumber,
            cardType: paymentData.cardType,
            // stellarToken: stellarData.hash,
            stellarToken: "",
            // stallerResponse: JSON.stringify(stellarData),
            stallerResponse: "",
            orderAmount: paymentData.transactionAmount,
            merchantId: merchant._id,
            businessId: merchant.businessId ? merchant.businessId : "",
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        const worldnet_transaction = await Transaction.create(newTransaction);
        // if (paymentData.customer_email) {
        //     let email = paymentData.customer_email
        //     transactionMail(newTransaction, StoreData.createdAt, paymentData.worldnetResponse.uniqueRef, email, function (callbackres) {
        //         console.log("callbackers***************", callbackres);
        //     });
        // }
        return {
            message: 'success',
            data: {
                // stellarData,
                worldnet_transaction
            }
        };
    } catch (error) {
        console.log("catchErrorrrrrrrrrrrrrrrrrrr", error);
        return error
    }
};


const sendWorldnetEmail = async (paymentData) => {  //Payment done from POS DEvice and saved in Database
    console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPemail", paymentData)
    try {

        let createdAt = paymentData.createdAt
        // const merchant = await Merchant.findOne({ businessId: "3549d1c4-65c7-4348-a1e0-64eba63fa5d0" }); FRANK
        // const merchant = await Merchant.findOne({ businessId: "e8b3b726-0f3f-48a5-8f03-3c6ab5f10a93" });  //MH;
        const merchant = await Merchant.findOne({ businessId: paymentData.businessId || paymentData.terminal });  //ELAN
        let StoreData = {
            createdAt
        };
        console.log("merchantttttttttt", merchant)
        const newTransaction = {
            orderId: paymentData.orderId,
            transactionType: 0,
            transactionId: paymentData.orderId,
            transactionAmount: paymentData.transactionAmount,
            currency: paymentData.currency,
            status: paymentData.status,
            paymentProcessorType: 'Worldnet', // custom value to identify processor
            worldnetResponse: JSON.stringify(paymentData.worldnetResponse),
            cardHolderFirstName: "POS",
            cardHolderLastName: "-DEVICE",
            cardNumber: paymentData.cardNumber,
            cardType: paymentData.cardType,
            orderAmount: paymentData.transactionAmount,
            merchantId: merchant._id,
            businessId: merchant.businessId ? merchant.businessId : "",
            companyName: merchant.companyName ? merchant.companyName : "",
            merchant: merchant.contactName ? merchant.contactName : "",
            terminal_id: paymentData.businessId ? paymentData.businessId : "",
            transaction_fee: paymentData.transaction_fee ? paymentData.transaction_fee : "",
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        if (paymentData.customer_email) {
            let email = paymentData.customer_email
            transactionMail(newTransaction, StoreData.createdAt, paymentData.worldnetResponse.uniqueRef, email, function (callbackres) {
                console.log("callbackers***************", callbackres);
            });
        }
        return {
            message: 'Email sent successfully',
            data: {
            }
        };
    } catch (error) {
        console.log("catchErrorrrrrrrrrrrrrrrrrrr", error);
        return error
    }
};

function transactionMail(argument, created_at, uniqueRef, email) {
    try {
        const SEND_GRID_KEY = config.get('sendgrid.apiKey');

        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(SEND_GRID_KEY);

        const ordId = argument.orderId;
        const compName = argument.companyName;
        const merchantName = argument.merchant;
        const terminalId = argument.terminal_id;
        const txnId = argument.transactionId;
        const txnAmount = argument.transactionAmount;
        const txnfee = argument.transaction_fee;
        const unqRef = uniqueRef;
        const crtAt = created_at;


        const msg = {
            to: email,
            // from: 'ao@fluid.financial.com', // must be verified in SendGrid
            from: 'info@fluidfintec.com', // must be verified in SendGrid
            templateId: 'd-5c0b3f198d4d48c0ab1305ab1f1811d4',
            dynamicTemplateData: {
                transactionId: txnId,
                orderId: ordId,
                uniqueRef: unqRef,
                transactionAmount: txnAmount,
                createdAt: crtAt,
                companyName: compName,
                merchant: merchantName,
                terminal_id: terminalId,
                transaction_fee: txnfee,
            }
        };

        sgMail.send(msg)
            .then((response) => {
                console.log("✅ Email sent successfully:", response[0].statusCode);
            })
            .catch((error) => {
                console.error("❌ SendGrid send error:", error);
                if (error.response) {
                    console.error("Status Code:", error.response.statusCode);
                    console.error("Response Body:", error.response.body);
                } else {
                    console.error("Error Message:", error.message);
                }
            });

    } catch (error) {
        console.error("❌ Unexpected error in transactionMail:");
        console.error(error.message);
    }
}


const getPayment = async (uniqueReference) => {
    const token = await getAccessToken();

    const response = await axios.get(
        `${paymentUrl}/${uniqueReference}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return response.data;
};

module.exports = { createPayment, getPayment, sendWorldnetEmail };

