// controllers/worldnet.controller.js
const { createPayment, getPayment, sendWorldnetEmail } = require('../service/payment.service');

const postPayment = async (req, res) => {
    try {
        console.log("@@", req.body);
        const result = await createPayment(req.body);

        return res.status(200).json(result);
    } catch (err) {
        console.error('Payment Error:', err.response.data || err.message);
        return res.status(500).json({ error: 'Payment failed' });
    }
};

const getPaymentDetails = async (req, res) => {
    try {
        const { uniqueReference } = req.params; // Use path parameter instead of query
        if (!uniqueReference) {
            return res.status(400).json({ error: 'Unique reference is required' });
        }

        const result = await getPayment(uniqueReference);
        return res.status(200).json(result);
    } catch (err) {
        // console.error('Get Payment Error:', err.response?.data || err.message);
        const status = err.response.status || 500;
        const errorMessage = err.response.data.message || 'Failed to retrieve payment';
        return res.status(status).json({ error: errorMessage });
    }
};

const sendWorldnetTransactionEmail = async (req, res) => {
    try {
        console.log("@@", req.body);
        const result = await sendWorldnetEmail(req.body);

        return res.status(200).json(result);
    } catch (err) {
        console.error('Email Error:', err);
        return res.status(500).json({ error: 'failed' });
    }
};

module.exports = { postPayment, getPaymentDetails, sendWorldnetTransactionEmail };