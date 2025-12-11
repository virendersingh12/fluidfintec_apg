const mongoose = require("mongoose");
// const { ROLES, ROLE_VALUES } = require('../constants/userRoles');
// const { MERCHANT_STATUS, MERCHANT_STATUS_VALUES } = require('../constants/merchantStatus');
// const bcrypt = require('bcrypt');

// const salt = bcrypt.genSaltSync(10);

const schema = new mongoose.Schema({
    transactionId: {
        type: String,
        default: null
    },
    name:{
        type: String,
        default: null
    },
    quantity:{
        type: Number,
        default: null
    },
    totalAmount:{
        type: Number,
        default: null
    },
    taxFinals:{
        type: Object,
        default:null
    }
});

module.exports = mongoose.model("Product", schema);
