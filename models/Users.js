const mongoose = require("mongoose");
// const { ROLES, ROLE_VALUES } = require('../constants/userRoles');
// const { MERCHANT_STATUS, MERCHANT_STATUS_VALUES } = require('../constants/merchantStatus');
// const bcrypt = require('bcrypt');

// const salt = bcrypt.genSaltSync(10);

const schema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    customerUserId: {
        type: String,
    },
    cardId: {
        type: String,
    },
    cardHolderFirstName: {
        type: String,
    },
    cardHolderLastName: {
        type: String,
    },
    cardNumber: {
        type: String,
    },
    password: {
        type: String,
        maxlength: 128,
    },

    contactName: {
        type: String,
    },


    phoneNumberCall: {
        type: Number,
    },

    phoneNumberSMS: {
        type: Number,
    },

    apiSecretKey: {
        type: String,
    },

    secretKey: {
        type: String,
    },

    publicKey: {
        type: String,
    },

    apiKey: {
        type: String,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },

    isActivated: {
        type: "Boolean",
        default: false,
    },

    isDeleted: {
        type: "Boolean",
        default: false,
        required: true,
    },
});

module.exports = mongoose.model("Users", schema);
