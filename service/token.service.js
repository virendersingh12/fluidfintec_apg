const jwt = require('jsonwebtoken');
const config = require('config');
const axios = require('axios');
const Token = require('../models/token');
const { TOKEN_TYPE } = require('../constants/tokenType');

const generateJWT = (user) => {
  const expirationTime = config.get('jwt.expiration') + Math.trunc(Date.now() / 1000);

  return {
    token: jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.contactName,
        role: user.role,
        SAreferenceNumber: user.SAreferenceNumber,
        SAmerchantReferenceNumber: user.SAmerchantReferenceNumber,
        exp: expirationTime
      },
      config.get('jwt.secret')
    ),
    expirationTime: expirationTime
  };
};

const generateRefreshJWT = (user) => {
  const expirationTime = config.get('jwt.refreshTokenExpiration') + Math.trunc(Date.now() / 1000);

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.contactName,
      role: user.role,
      SAreferenceNumber: user.SAreferenceNumber,
      SAmerchantReferenceNumber: user.SAmerchantReferenceNumber,
      exp: expirationTime
    },
    config.get('jwt.refresh_token_secret')
  );
};

const generateAuthToken = async (user) => {
  const token = generateJWT(user);
  const refreshToken = generateRefreshJWT(user);

  await Token.create({
    token: refreshToken,
    type: TOKEN_TYPE.REFRESH,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });

  return {
    ...token,
    refreshToken,
  };
};

const apiKey = config.get('worldnet.apiKey');
const authUrl = config.get('worldnet.authUrl');
let cachedToken = null;

const getAccessToken = async () => {
  if (cachedToken && cachedToken.expires > Date.now()) {
    return cachedToken.token;
  }
  console.log("123")

  const response = await axios.get(`${authUrl}`, {
    headers: {
      Authorization: `Basic ${apiKey}`,
    },
  });

  // console.log("###111111111", response);

  const { token, expiresIn } = response.data;
  console.log("###", response.data);

  cachedToken = {
    token: token,
    expires: Date.now() + (expiresIn * 1000 - 60000), // minus 1 min buffer
  };
  return token;
};

module.exports = {
  generateAuthToken,
  generateJWT,
  generateRefreshJWT,
  getAccessToken
};
