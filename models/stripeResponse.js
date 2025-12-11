const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new mongoose.Schema({
    transaction_id: {
        type: String,
    },
    amount: {
        type: Number
    },
    name: {
        type: String
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

module.exports = mongoose.model('stripePaymentData', schema);