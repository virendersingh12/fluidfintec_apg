const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new mongoose.Schema({
    merchantId: {
        type: String,
        default: null
    },
    userId: {
        type: String,
        default: null
    },
    transactionId: {
        type: String,
        default: null
    },

    employeeUserId: {
        type: Number,
        default: null
    },

    storeDeviceId: {
        type: String,
        default: null
    },

    businessId: {
        type: String,
        default: null
    },

    storeId: {
        type: String,
        default: null
    },
    stellarToken: {
        type: String,
        default: null
    },
    transactionType: {
        type: Number,    //0-token 1- catalouge
        default: 0
    },

    customerUserId: {
        type: Number,
        default: null
    },

    status: {
        type: String,
        default: null
    },

    customerLanguage: {
        type: String,
        default: null
    },

    customerOptedNoTip: {
        type: String,
        default: null
    },

    tipAmount: {
        type: Number,
        default: null
    },

    orderAmount: {
        type: Number,
        default: null
    },
    orderId: {
        type: String,
        default: null
    },
    sku: {
        type: String,
        default: null
    },
    transactionAmount: {
        type: Number,
    },
    cashbackAmount: {
        type: String,
    },
    cardNumber: {
        type: String,
    },
    cardType: {
        type: String,
    },
    cardHolderFirstName: {
        type: String,
    },
    cardHolderLastName: {
        type: String,
    },
    cardId: {
        type: String,
    },
    currency: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: new Date()
    },

    updatedAt: {
        type: Date,
        default: new Date()
    },


});
schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Transaction', schema);
