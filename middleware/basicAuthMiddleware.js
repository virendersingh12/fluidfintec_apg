const basicAuth = require('express-basic-auth');
const { getMerchantByAPIKey } = require('../repository/merchant.repository');

const authorizer = async (apiKey, apiSecretKey, callback) => {
  const merchant = await getMerchantByAPIKey(apiKey);

  if (merchant && merchant.apiSecretKey === apiSecretKey) {
    return callback(null, true);
  }

  return callback(null, false);
}

module.exports = basicAuth({
  authorizer,
  authorizeAsync: true,
})
