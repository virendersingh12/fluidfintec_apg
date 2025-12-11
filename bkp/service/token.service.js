const jwt = require('jsonwebtoken');
const config = require('config');
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

module.exports = {
  generateAuthToken,
  generateJWT,
  generateRefreshJWT,
};
