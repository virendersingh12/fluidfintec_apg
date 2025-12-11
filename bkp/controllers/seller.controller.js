const { default: axios } = require('axios');
var { v4: uuid } = require('uuid');
const Transaction = require('../models/Transaction');



const transactions = async (req, res) => {
    console.log("req", req.query)
    const params = req.query;

    axios.get(`https://v2-extapi.lunextelecom.com/pos/sellers/APG01D999TEST/trans?from_date=${params.from_date}&to_date=${params.to_date}`, {
        auth: {
            username: 'APGITINCTESTING',
            password: 'apgit11022022'
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

const postOrderTopup = async (req, res) => {
    const c_id = uuid();
    const { amount, lang, merchantid, merchantname, phone, promo_phone, quantity, sku } = req.body;
    const { seller_id } = req.params;


    axios.post(`https://v2-extapi.lunextelecom.com/pos/sellers/${seller_id}/gift-card-orders/${c_id}?amount=${amount}&lang=${lang}&merchantid=${merchantid}&merchantname=${merchantname}&phone=${phone}&promo_phone=${promo_phone}&quantity=${quantity}&sku=${sku}`, {
        auth: {
            username: 'APGITINCTESTING',
            password: 'apgit11022022'
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
    console.log('reqqq______', params)

    axios.get(`https://v2-extapi.lunextelecom.com/pos/sellers/APG01D999TEST/skus?type=${params.type}`, {
        auth: {
            username: 'APGITINCTESTING',
            password: 'apgit11022022'
        }
    }).then(response => {
        console.log(">>>>>>data", response);
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
        total: payload.total

    },
        {
            headers: {
                'Content-type': 'application/json',
                'APIKEY': '849afecafdcb4b2454ab92237018e4e9'
            },
        }).then(async response => {
            console.log(">>>>>>data", response);
            var data = response.data

            if (data.response.data.length === 0) {
                return res.json({ error: true, msg: "transaction failed", body: data })
            } else if (data.response.data.length > 0) {
                if (!data.response.data[0].id) {
                    return res.json({ error: true, msg: "transaction failed", body: data })
                }
            }

            // const insertData = {
            //     merchantId: payload.merchant,
            //     userId: payload.merchant,
            //     transactionId: data.response.data[0].id,
            //     transactionAmount: payload.total,
            //     cardNumber: payload.payment.number,
            //     cardHolderFirstName: payload.first,
            //     cardHolderLastName: payload.last,
            //     currency: 'USD',
            //     type: payload.type,
            //     origin: payload.origin,
            //     expiration: payload.expiration,

            // }
            // const data1 = await Transaction.create(insertData);

            // console.log('data1___________', data1)
            // console.log('data_________________________', data)
            res.json({ error: false, msg: "Success", body: data })
        }).catch(error => {
            console.log("error", error.message)
            res.json({ error: true, msg: error.message, body: [] })
        })
}

const paymentDetails = async (req, res) => {
    const payload = req.body;
    console.log('payload_______', payload);
    // console.log('payload**********_______', payload.stallerToken);

    const insertData = {

        merchantId: payload.paymentResponse.merchant,
        userId: payload.paymentResponse.merchant,
        transactionId: payload.txnId,
        orderId: payload.orderId,
        sku: payload.sku,
        stellarToken: payload.stallerToken,
        transactionAmount: payload.total,

    }
    const data1 = await Transaction.create(insertData);
    console.log('data1___________', data1)


    res.json({ error: false, msg: "Success", body: data1 })

}
module.exports = { transactions, postOrderTopup, listProduct, payment, paymentDetails }