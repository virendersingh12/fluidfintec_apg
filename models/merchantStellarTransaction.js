const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  txId: {
    type: String,
  },
  type: {
    type: String,
  },
  asset: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
  network: {
    type: String,
  },
  merchant_id: {
    type: String,
  },
  principal_id: {
    type: String,
  },
  primary_amount: {
    type: String,
  },
  rolling_reserve_amount: {
    type: String,
  },
  rolling_reserve_release_term: {
    type: String,
  },
  merchant_fee_receivable_amount: {
    type: String,
  },
  merchant_fee_receivable_date: {
    type: String,
  },
  acquiring_bank_id: {
    type: String,
  },
  acquiring_bank_fees_payable_amount: {
    type: String,
  },
  acquiring_bank_fees_payable_date: {
    type: Date,
  },
  broker_id: {
    type: String,
  },
  broker_fees_payable_amount: {
    type: String,
  },
  broker_fees_payable_date: {
    type: String,
  },
  rolling_reserve_release_flag: {
    type: Boolean,
  },
  to_account: {
    type: String,
  },
});

module.exports = mongoose.model('MerchantStellarTransaction', schema);
