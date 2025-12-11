const debug = require('debug');
const error = debug('edex:rout:sess:error');
const log = debug('edex:rout:sess');
const Merchant = require("../models/merchant");
const Token = require('../models/token');
const sessionService = require('../service/auth.service');
const emailService = require('../service/email.service');
const { TOKEN_TYPE } = require('../constants/tokenType');
const merchantService = require("../service/merchant.service")

const UIDGenerator = require('uid-generator');
const UIDBase62Char16 = new UIDGenerator(UIDGenerator.BASE62, 16);

const getUser = async (req, res) => {
  console.log("get!!!!!");
  const { user } = req;

  try {
    const merchantData = await Merchant.findById(user.id).select('id status email role  publicKey apiKey apiSecretKey');
    const params = {
      email: merchantData.email,
    };
    const merchant = await Merchant.aggregate([
      { $match: params },
      {
        $lookup:
        {
          from: "payees",
          localField: "_id",
          foreignField: "userId",
          as: "contacts"
        }
      },
    ]);

    return res.json({ result: merchant[0], ok: true });
  } catch (err) {
    error(err);
    return res.json({ error: 'error getting session', ok: false })
  }
};

// const loginEmail = async (req, res) => {
//   const { email, password } = req.body;
//   sessionService.loginEmail(email, password)
//     .then(
//       result => res.json({ result, ok: true }),
//       err => {
//         res.json({ error: 'error logging in', ok: false });
//         error(err)
//       }

//     );
// };
const loginEmail = async (req, res) => {
  const { email, password } = req.body;
  sessionService.loginEmail(email, password)
    .then(result => {
      return res.json({ result, ok: true })
    }
    )
    .catch(err => {
      console.log('error', err)
      return res.json({ error: 'error logging in', ok: false });
    });
};

const getToken = async (req, res) => {
  const { refreshToken } = req.body;

  sessionService.getToken(refreshToken)
    .then(
      result => res.json({ result, ok: true }),
      err => {
        res.json({ error: err, ok: false })
      }
    );
};

const activateAccount = async (req, res) => {
  const { token } = req.body;

  try {
    const tokenDoc = await Token.findOne({ token, type: TOKEN_TYPE.ACTIVATE_ACCOUNT });
    if (!tokenDoc) {
      return res.json({ error: 'Not found token!', ok: false });
    }

    if (new Date(tokenDoc.expires).getTime() < new Date().getTime()) {
      return res.json({ error: 'expired', ok: false });
    }

    const merchant = await Merchant.findById(tokenDoc.merchant);

    if (!merchant) {
      return res.json({ error: 'Not found user!', ok: false });
    }

    merchant.isActivated = true;
    await merchant.save();

    await Token.deleteMany({ merchant: merchant.id, type: TOKEN_TYPE.ACTIVATE_ACCOUNT });

    return res.json({ result: {}, ok: true });
  } catch (err) {
    return res.json({ error: err, ok: false });
  }
};

const resendActivationEmail = async (req, res) => {
  const { token } = req.body;

  try {
    const tokenDoc = await Token.findOne({ token, type: TOKEN_TYPE.ACTIVATE_ACCOUNT });
    if (!tokenDoc) {
      return res.json({ error: 'Not Found Token', ok: false });
    }
    tokenDoc.token = UIDBase62Char16.generateSync();
    tokenDoc.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await tokenDoc.save();

    const merchant = await Merchant.findById(tokenDoc.merchant);
    if (!merchant) {
      return res.json({ error: 'Not found merchant', ok: false });
    }

    await emailService.sendMerchantRegistrationEmail(merchant.email, merchant.contactName, token.token);

    return res.status(200).send({ ok: true });
  } catch (err) {
    return res.json({ error: err, ok: false });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const merchant = await Merchant.findOne({ email });
    if (!merchant) {
      return res.json({ error: 'No account with that email address exists. ', ok: false });
    }

    const token = UIDBase62Char16.generateSync();

    await Token.create({
      token,
      type: TOKEN_TYPE.RESET_PASSWORD,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      merchant: merchant.id
    });

    await emailService.sendMerchantPasswordResetEmail(merchant.email, merchant.contactName, token);

    return res.status(200).send({ ok: true });
  } catch (err) {
    return res.json({ error: err, ok: false });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const tokenDoc = await Token.findOne({ token, type: TOKEN_TYPE.RESET_PASSWORD });
    if (!tokenDoc) {
      return res.json({ error: 'Not Found Token', ok: false });
    }

    if (new Date(tokenDoc.expires).getTime() < new Date().getTime()) {
      return res.json({ error: 'expired', ok: false });
    }

    const merchant = await Merchant.findById(tokenDoc.merchant);
    if (!merchant) {
      return res.json({ error: 'Not found merchant', ok: false });
    }

    const updatedPassword = await merchantService.createHash(password);

    await merchant.updateOne({ password: updatedPassword, isActivated: true });

    await emailService.sendMerchantPasswordResetSuccessfullyEmail(merchant.email, merchant.contactName);

    return res.status(200).send({ ok: true });
  } catch (err) {
    return res.json({ error: err, ok: false });
  }
};

module.exports = {
  getUser,
  loginEmail,
  getToken,
  activateAccount,
  resendActivationEmail,
  requestPasswordReset,
  resetPassword
};
