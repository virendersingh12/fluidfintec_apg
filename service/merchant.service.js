const bcrypt = require('bcrypt');
const Merchant = require('../models/merchant');
const MerchantDetail = require('../models/merchantDetail');
const emailService = require('./email.service');
const stellar = require('./stellar');
const Token = require('../models/token');
const { generateApiKey, generateStellarKey, generateToken, generateAPISecretKey } = require('../helpers/apiKeyFuncs');
const { TOKEN_TYPE } = require('../constants/tokenType');
const { MERCHANT_STATUS, MERCHANT_STATUS_TEXT, MERCHANT_DETAIL_SECTION_STATUS } = require('../constants/merchantStatus');
const { ROLES } = require('../constants/userRoles');


const createHash = async (value) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(value, 15, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
};

const createNewPendingUser = async (data, user_password, roles) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(data, 'data');
      const user = await Merchant.findOne({ email: data.email });
      console.log(user, "user ");
      if (user) {
        reject({ message: 'Email already exists.' });
      } else {
        const userPassword = await createHash(user_password);

        const { publicKey, secretKey } = generateStellarKey();
        const apiKey = generateApiKey();
        const apiSecretKey = generateAPISecretKey();
        let role;
        if (roles) {
          role = ROLES.ADMIN;
        } else if (data.salesAgent == true) {
          role = ROLES.SALES_AGENT
        } else if (data.einNumber || data.companyName) {
          role = ROLES.MERCHANT;
        } else {
          role = ROLES.USER
        }
        if (data.salesAgent == true) {
          var SAreferenceNumber = Math.floor(100000 + Math.random() * 900000);
          var SAmerchantReferenceNumber = ''
        } else {
          var SAreferenceNumber = ''
          var SAmerchantReferenceNumber = data.SAmerchantReferenceNumber
        }
        const newUser = {
          ...data,
          role,
          SAmerchantReferenceNumber: SAmerchantReferenceNumber,
          SAreferenceNumber: SAreferenceNumber,
          apiKey: apiKey,
          secretKey: secretKey,
          publicKey: publicKey,
          apiSecretKey: apiSecretKey,
          password: userPassword,
        };
        console.log("newuserrrrrrrrrrr", newUser)

        const merchant = await Merchant.create(newUser);
        await MerchantDetail.create({ merchant: merchant.id });
        const token = await Token.create({
          token: generateToken(),
          merchant: merchant.id,
          type: TOKEN_TYPE.ACTIVATE_ACCOUNT,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          blacklisted: false,
        });
        console.log("token_______", token)
        // if(type === ROLES.MERCHANT){
        await stellar.accounts.initialiseAccount(secretKey);
        // }
        await emailService.sendMerchantRegistrationEmail(merchant.email, merchant.contactName, token.token);
        resolve();
      }

    } catch (error) {
      reject(error);
    }
  });
};

const addComment = async (merchantId, commentType, content, reviewer) => {
  if (reviewer.role === ROLES.ADMIN || ROLES.SUPER_ADMIN) {
    const merchant = await Merchant.findById(merchantId);
    if (merchant.status === MERCHANT_STATUS.WEB || merchant.status === MERCHANT_STATUS.UPLOAD) {
      merchant.status = MERCHANT_STATUS.ASSESSED;
      await merchant.save();

      await emailService.sendMerchantStatusUpdatedEmail(
        merchant.email,
        merchant.contactName,
        MERCHANT_STATUS_TEXT[MERCHANT_STATUS.ASSESSED],
      );
    }
  }

  const merchantDetail = await MerchantDetail.findOneAndUpdate(
    { merchant: merchantId },
    {
      $push: {
        [commentType]: {
          content,
          userEmail: reviewer.email,
          createdAt: Date.now()
        }
      }
    },
    { upsert: true, new: true },
  ).populate({ path: 'merchant', select: '_id email companyName phoneNumberCall role phoneNumberSMS einNumber offerCode status businessId applicationId applicationIdkey apiKey apiSecretKey' });

  if (reviewer.email !== merchantDetail.merchant.email) {
    await emailService.sendAccountReviewedEmail(
      merchantDetail.merchant.email,
      merchantDetail.merchant.contactName,
      reviewer.name,
    );
  }

  return merchantDetail;
};

const approve = async (merchantId) => {
  const merchant = await Merchant.findByIdAndUpdate(merchantId, { status: MERCHANT_STATUS.APPROVED });

  await emailService.sendMerchantStatusUpdatedEmail(
    merchant.email,
    merchant.contactName,
    MERCHANT_STATUS_TEXT[MERCHANT_STATUS.APPROVED],
  );

  return MerchantDetail.findOneAndUpdate(
    { merchant: merchantId },
    {
      personalInfoStatus: MERCHANT_DETAIL_SECTION_STATUS.APPROVED,
      additionalInfoStatus: MERCHANT_DETAIL_SECTION_STATUS.APPROVED,
      sourceOfSaleStatus: MERCHANT_DETAIL_SECTION_STATUS.APPROVED,
      processingInfoStatus: MERCHANT_DETAIL_SECTION_STATUS.APPROVED,
      kycInfoStatus: MERCHANT_DETAIL_SECTION_STATUS.APPROVED,
      taxInfoStatus: MERCHANT_DETAIL_SECTION_STATUS.APPROVED,
      bankInfoStatus: MERCHANT_DETAIL_SECTION_STATUS.APPROVED,
      startupInfoStatus: MERCHANT_DETAIL_SECTION_STATUS.APPROVED,
      productInfoStatus: MERCHANT_DETAIL_SECTION_STATUS.APPROVED,
      communicationStatus: MERCHANT_DETAIL_SECTION_STATUS.APPROVED,
      companyInfoStatus: MERCHANT_DETAIL_SECTION_STATUS.APPROVED,
    },
    { upsert: true, new: true }
  ).populate({ path: 'merchant', select: '_id email companyName phoneNumberCall role phoneNumberSMS einNumber offerCode status businessId applicationId applicationIdkey apiKey apiSecretKey' });
};

module.exports = {
  createNewPendingUser,
  addComment,
  approve,
  createHash
};
