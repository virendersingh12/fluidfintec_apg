module.exports = (roles) => async (req, res, next) => {
  if (req.user && roles.includes(req.user.role)) {
    next();
  } else {
    res.sendStatus(401);
  }
}
