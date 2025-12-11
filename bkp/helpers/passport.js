const passportJWT = require('passport-jwt');
const Strategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const config = require('config');
const Merchant = require('../models/merchant');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    const merchant = await Merchant.findById(payload.id);
    if (!merchant) {
      return done(null, false);
    }
    return done(null, merchant);
  } catch (err) {
    return done(err, false);
  }
};

const jwtStrategy = new Strategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy
}
