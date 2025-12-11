const mongoose = require('mongoose');
const { TOKEN_TYPE, TOKEN_TYPE_VALUES } = require('../constants/tokenType');

const schema = new mongoose.Schema(
  {
    token: {
      type: String,
    },
    type: {
      type: String,
      enum: TOKEN_TYPE_VALUES,
      default: TOKEN_TYPE.REFRESH,
    },
    merchant: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Merchant'
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Token', schema);
