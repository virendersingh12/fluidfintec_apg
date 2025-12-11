const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  merchant: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Merchant'
  },
  request: {
    type: Object,
  },
  amount: {
    type: Number,
  },

  currency: {
    type: String,
  },

  asset: {
    type: String,
  },

  response: {
    type: Object,
  },

  stellar_tx: {
    type: Object
  }
});

module.exports = mongoose.model('CardstreamTx', schema);
