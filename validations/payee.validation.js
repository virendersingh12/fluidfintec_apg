const { Joi } = require("express-validation");

module.exports = {
  newPayee: {
    body: Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
        stellarPublicKey: Joi.string().required(),
      // phone: Joi.string().required(),
    })
  }
};
