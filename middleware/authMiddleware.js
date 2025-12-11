const passport = require('passport');

module.exports = (req, res, next) => {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => {
      if (err || info || !user) {
        return res.sendStatus(401);
      }
      req.user = user;


      next();
    }
  )(req, res, next);
}
