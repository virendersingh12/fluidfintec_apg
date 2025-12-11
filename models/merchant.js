const mongoose = require('mongoose');
const { ROLES, ROLE_VALUES } = require('../constants/userRoles');
const { MERCHANT_STATUS, MERCHANT_STATUS_VALUES } = require('../constants/merchantStatus');
// const bcrypt = require('bcrypt');

// const salt = bcrypt.genSaltSync(10);

const schema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    // unique: true
  },
  password: {
    type: String,
    maxlength: 128,
  },

  contactName: {
    type: String,
  },

  companyName: {
    type: String,
  },

  offerCode: {
    type: String,
  },
  SAreferenceNumber: {
    type: String,
    allowNull: true,
  },
  SAmerchantReferenceNumber: {
    type: String,
    allowNull: true,
  },
  commissionPercent: {
    type: String,
    allowNull: true,
  },
  body: {
    type: String,
    allowNull: true
  },
  totalEarning: {
    type: String,
    allowNull: true
  },

  paymentProcessor: {
    type: String,
  },
  payrixMerchantId: {
    type: String,
  },
  paypalClientId: {
    type: String,
  },
  paypalSecret: {
    type: String,
  },
  stripePublic: {
    type: String,
  },
  stripeSecret: {
    type: String,
  },

  phoneNumberCall: {
    type: Number,
  },

  phoneNumberSMS: {
    type: Number,
  },
  einNumber: {
    type: String,
  },

  role: {
    type: String,
    enum: ROLE_VALUES,
    default: ROLES.MERCHANT
  },

  status: {
    type: String,
    enum: MERCHANT_STATUS_VALUES,
    default: MERCHANT_STATUS.WEB,
  },

  apiSecretKey: {
    type: String,
  },

  secretKey: {
    type: String,
  },

  publicKey: {
    type: String
  },

  apiKey: {
    type: String,
  },
  businessId: {
    type: String,
  },
  applicationIdkey: {
    type: String,
  },
  applicationId: {
    type: String
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
    type: 'Boolean',
    default: false,
  },

  isDeleted: {
    type: 'Boolean',
    default: false,
    required: true,
  },
});

module.exports = mongoose.model('Merchant', schema);
