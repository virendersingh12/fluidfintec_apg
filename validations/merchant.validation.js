const { Joi } = require("express-validation");

module.exports = {
  createMerchant: {
    body: Joi.object({
      signupEmail: Joi.string().email().required(),
      signupPassword: Joi.string().required().min(6).max(128),
      // phone: Joi.string().required(),
    })
  }
};
