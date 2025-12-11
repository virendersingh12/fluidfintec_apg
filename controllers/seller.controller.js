const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');
var { v4: uuid } = require('uuid');
const Transaction = require('../models/Transaction');
const Users = require('../models/Users');
const Merchant = require("../models/merchant");
const stripePaymentData = require('../models/stripeResponse');
const MerchantDetail = require('../models/merchantDetail');
const config = require('config');
const StripePayment = require('../payment/stripe');




const transactions = async (req, res) => {
    // console.log("req", req.query)
    const params = req.query;
    const { seller_id } = req.query;

    // res.json({ error: false, msg: "Success", body: data })
    // return;
    axios.get(`https://v2-extapi.lunextelecom.com/pos/sellers/${seller_id}/trans/?from_date=${params.from_date}&to_date=${params.to_date}`, {
        headers: {
            Authorization: 'Basic ' + Buffer.from('APGITINCTESTING:apgit11022022').toString('base64')
        }
    }).then(response => {
        // console.log(">>>>>>data", response);
        var data = response.data
        res.json({ error: false, msg: "Success", body: data })
    }).catch(error => {
        console.log("error______________", error.response)
        res.json({ error: true, msg: error.response.data.detail, body: [] })
    })
}

const postOrderTopup = async (req, res) => {
    const c_id = uuid();
    const { amount, lang, merchantid, merchantname, phone, promo_phone, quantity, sku } = req.body;
    const { seller_id } = req.params;
    let promo = ""
    if (promo_phone) {
        promo = promo_phone
    }
    console.log('respo__________', req.body)

    if (req.params.seller_id == 'APG01D999TEST') {

        var auth = 'Basic ' + Buffer.from('APGITINCTESTING:apgit11022022').toString('base64')

    } else {
        auth = 'Basic ' + Buffer.from('APGITINC:apgit01172023').toString('base64')
    }

    axios.post(`https://v2-extapi.lunextelecom.com/pos/sellers/${seller_id}/gift-card-orders/${c_id}?amount=${amount}&lang=${lang}&merchantid=${merchantid}&merchantname=${merchantname}&phone=${phone}&promo_phone=${promo}&quantity=${quantity}&sku=${sku}`, {}, {

        headers: {
            Authorization: auth
        }

    }).then(response => {
        console.log(">>>>>>data", response);
        var data = response.data
        res.json({ error: false, msg: "Success", body: data })
    }).catch(error => {
        console.log("error_________________________", error.response)
        res.json({ error: true, msg: error.response.data.detail, body: [] })
    })
}

const listProduct = async (req, res) => {
    const params = req.query
    const { seller_id } = req.query;


    axios.get(`https://v2-extapi.lunextelecom.com/pos/sellers/${seller_id}/skus?type=${params.type}`, {
        headers: {
            Authorization: 'Basic ' + Buffer.from('APGITINCTESTING:apgit11022022').toString('base64')
        }
    }).then(response => {
        // console.log(">>>>>>data", response);
        var data = response.data
        res.json({ error: false, msg: "Success", body: data })
    }).catch(error => {
        console.log("error", error.response)
        res.json({ error: true, msg: error.response.data.detail, body: [] })
    })
}

const payment = async (req, res) => {
    const payload = req.body;
    console.log('payload_______', payload);

    axios.post(`https://test-api.payrix.com/txns`, {


        payment: {
            method: payload.payment.method,
            number: payload.payment.number,
            cvv: payload.payment.cvv
        },
        merchant: payload.merchant,
        address1: payload.address1,
        city: payload.city,
        state: payload.state,
        zip: payload.zip,
        email: payload.email,
        phone: payload.phone,
        first: payload.first,
        last: payload.last,
        type: payload.type,
        origin: payload.origin,
        expiration: payload.expiration,
        total: payload.total,


    },
        {
            headers: {
                'Content-type': 'application/json',
                'APIKEY': '849afecafdcb4b2454ab92237018e4e9'
            },
        }).then(async response => {
            // console.log(">>>>>>data", response);
            var data = response.data

            if (data.response.data.length === 0) {
                return res.json({ error: true, msg: "transaction failed", body: data })
            } else if (data.response.data.length > 0) {
                if (!data.response.data[0].id) {
                    return res.json({ error: true, msg: "transaction failed", body: data })
                }
            }


            res.json({ error: false, msg: "Success", body: data })
        }).catch(error => {
            // console.log("error", error.message)
            res.json({ error: true, msg: error.message, body: [] })
        })
}

const paymentDetails = async (req, res) => {
    const payload = req.body;
    console.log('payload_______', payload);
    console.log('payload_______', req);


    let paymentResponse = payload.paymentResponse ? JSON.stringify(payload.paymentResponse) : null;
    let paypalResponse = payload.paypalResponse ? JSON.stringify(payload.paypalResponse) : null;
    let stripeResponse = payload.stripeResponse ? JSON.stringify(payload.stripeResponse) : null;
    let stallerResponse = payload.stallerResponse ? JSON.stringify(payload.stallerResponse) : null;
    let merchantId = '';
    if (payload.merchantId) merchantId = payload.merchantId
    else if (payload.paymentResponse && payload.paymentResponse.merchant) merchantId = payload.paymentResponse.merchant
    else merchantId = '';
    const insertData = {
        paymentResponse,
        paypalResponse,
        stripeResponse,
        stallerResponse,
        merchantId,
        userId: '638f4056ec921f2d707f64c2',
        transactionId: payload.txnId,
        paymentProcessorType: payload.paymentProcessorType,
        orderId: payload.orderId,
        sku: payload.sku,
        stellarToken: payload.stallerToken,
        transactionAmount: payload.total,
        stallerAccount: payload.stallerAccount,
        vCardNo: payload.vCardNo,
        createdAt: payload.createdAt,
        updatedAt: payload.updatedAt,
        // SAmerchantReferenceNumber: payload.SAmerchantReferenceNumber
    }
    const data1 = await Transaction.create(insertData);
    // console.log('data1___________', insertData)


    res.json({ error: false, msg: "Success", body: data1 })

}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.get('jwt.secret'));
    } catch (err) {
        return null;
    }
}

const getTransactions = async (req, res) => {
    const payload = req.query;
    const tokenData = req.headers.authorization;
    const { type } = payload;
    let token = null;
    if (tokenData) {
        token = tokenData.split(' ')[1];
    } else {
        return res.status(400).json({ status: false, message: 'Please provide token', result: [] });
    }
    // console.log('tokenData______________', token)
    const tokenObj = verifyToken(token)
    if (!tokenObj) {
        return res.status(400).json({ status: false, message: 'Please provide valid token', result: [] });
    }

    // console.log('payload_____', config.get('jwt.secret'), tokenObj)
    const data = await Transaction.find(tokenObj.role === 'SuperAdmin' ? {} : type && type !== 'Payrix' ? { paymentProcessorType: type, userId: tokenObj.id } : { userId: tokenObj.id }).sort({ "createdAt": -1 });
    // const data = await Transaction.find( type && type !== 'Payrix'? {paymentProcessorType:type}: {}).sort({ "createdAt": -1 });
    // console.log('data)()()()))',data)

    let newData = [];
    if (type === 'Paypal') {
        newData = data.filter(obj => {
            if (obj.paypalResponse) {
                return obj;
            }
        })
    } else if (type === 'Payrix') {
        newData = data.filter(obj => {
            if (obj.paymentResponse) {
                return obj;
            }
        })
    } else if (type === 'Stripe') {
        newData = data.filter(obj => {
            if (obj.stripeResponse) {
                return obj;
            }
        })
    } else {
        newData = data.filter(obj => {
            if (obj.stripeResponse || obj.paymentResponse || obj.paypalResponse) {
                return obj;
            }
        })
    }

    // console.log('data_______', data)

    return res.status(200).json({ status: true, message: 'Data fetched successfully', result: newData });

}

const getPaymentProcessor = async (req, res) => {
    // const payload = req.params;
    // const data = await MerchantDetail.MerchantDetail({merchant : '6253d71db9fa1f89d0d8dc53'});
    let merchantDetail = {}
    merchantDetail = await MerchantDetail.findOne(
        { merchant: '638f4056ec921f2d707f64c2' },
    ).populate({ path: 'merchant', select: '_id email role companyName phoneNumberCall phoneNumberSMS einNumber offerCode paymentProcessor status publicKey apiSecretKey apiKey contactName businessId applicationId applicationIdkey' });
    return res.status(200).json({ status: true, message: 'Data fetched successfully', result: merchantDetail.paymentProcessor });


}

const stripePayment = async (req, res) => {
    const data = {};
    const payload = req.body
    StripePayment.payment(payload, async (payRes) => {
        console.log('payres________', payRes);
        if (payRes.error == true) {
            console.log('error', payRes.error)
            data['error'] = true;
            data['msg'] = "Payment Failed";
            data['body'] = [];
            res.json(data)
            return
        } else {
            console.log("<><><><><payRes", payRes)
            const insertData = {
                transaction_id: payRes.body.id,
                amount: payRes.body.amount / 100,
                name: payRes.body.billing_details.name
            }
            payload.payment_id = payRes.body.balance_transaction
            try {
                const newResponse = await stripePaymentData.create(insertData)
                res.json({ status: 'success', error: false, body: payRes, newResponse })
            } catch (err) {
                console.log("errr", err.message)
                res.json({ status: 'error', error: true, body: [] })
            }
            //  await orderService.order(payload, res, next)

        }
    })

}

const deleteUser = async (req, res) => {
    const data = {};
    const payload = req.body;
    const data1 = await Merchant.remove({ email: payload.email })

    return res.status(200).json({ status: true, message: 'Data fetched successfully', result: data1 });


}

// const phoneTopup = async (req, res) => {
//     const c_id = uuid();
//     const { amount, lang, merchantid, merchantname, phone, phone_type, quantity, sku } = req.body;
//     const { seller_id } = req.params;
//     if (req.params.seller_id == 'APG01D999TEST') {

//         var auth = 'Basic ' + Buffer.from('APGITINCTESTING:apgit11022022').toString('base64')

//     } else {
//         auth = 'Basic ' + Buffer.from('APGITINC:apgit01172023').toString('base64')
//     }


//     axios.post(`https://v2-extapi.lunextelecom.com/pos/sellers/${seller_id}/pinless-orders/${c_id}?amount=${amount}&lang=${lang}&merchantid=${merchantid}&merchantname=${merchantname}&phone=${phone}&phone_type=${phone_type}&quantity=${quantity || 1}&sku=${sku || 1090}`, {}, {
//         headers: {
//             Authorization: auth
//         }

//     }).then(response => {
//         console.log(">>>>>>data", response);
//         var data = response.data
//         res.json({ error: false, msg: "Success", body: data })
//     }).catch(error => {
//         console.log("error_________________________", error.response)
//         res.json({ error: true, msg: error.response.data.detail, body: [] })
//     })
// }

const phoneTopup = async (req, res) => {
    const c_id = uuid();
    const { amount, lang, merchantid, merchantname, phone, phone_type, quantity, sku } = req.body;
    const { seller_id } = req.params;
    if (req.params.seller_id == 'APG01D999TEST') {

        var auth = 'Basic ' + Buffer.from('APGITINCTESTING:apgit11022022').toString('base64')

    } else {
        auth = 'Basic ' + Buffer.from('APGITINC:apgit01172023').toString('base64')
    }


    axios.post(`https://v2-extapi.lunextelecom.com/pos/sellers/${seller_id}/topup-orders/${c_id}?amount=${amount}&lang=${lang}&merchantid=${merchantid}&merchantname=${merchantname}&phone=${phone}&phone_type=${phone_type}&quantity=${quantity || 1}&sku=${sku || 1090}`, {}, {
        headers: {
            Authorization: auth
        }

    }).then(response => {
        console.log(">>>>>>data", response);
        var data = response.data
        res.json({ error: false, msg: "Success", body: data })
    }).catch(error => {
        console.log("error_________________________", error.response)
        res.json({ error: true, msg: error.response.data.detail, body: [] })
    })
}

module.exports = { transactions, postOrderTopup, listProduct, payment, paymentDetails, getTransactions, getPaymentProcessor, stripePayment, deleteUser, phoneTopup }