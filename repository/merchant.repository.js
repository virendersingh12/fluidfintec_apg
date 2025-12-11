const Merchant = require('../models/merchant');
const MerchantDetail = require('../models/merchantDetail');
const MerchantTypes = require('../models/merchantTypes');
const { ROLES } = require('../constants/userRoles');
const { MERCHANT_STATUS, MERCHANT_DETAIL_SECTION_STATUS } = require('../constants/merchantStatus');
const { generateApiKey, generateStellarKey, generateAPISecretKey } = require('../helpers/apiKeyFuncs');

const search = async (filter = {}) => {
  const { search = '', status, role, isDeleted } = filter;

  const searchRegExp = new RegExp(search, 'i');

  const filterOptions = {
    $or: [
      { email: { $in: [searchRegExp] } },
      { contactName: { $in: [searchRegExp] } }
    ],
  };

  if (status) {
    filterOptions.status = status;
  }
  if (role) {
    filterOptions.role = role;
  }
  filterOptions.isDeleted = isDeleted;

  return Merchant
    .find(filterOptions)
    .select('_id email contactName companyName role  einNumber offerCode phoneNumberCall phoneNumberSMS status publicKey apiKey apiSecretKey paymentProcessor SAreferenceNumber SAmerchantReferenceNumber merchantId commissionPercent totalEarning');
};

const searchMerchants = async (filter = {}) => {
  filter.role = ROLES.MERCHANT;

  return search(filter);
};

const searchSalesAgent = async (filter = {}) => {
  filter.role = ROLES.SALES_AGENT;

  return search(filter);
};

const getSAmerchants = async (request) => {
  return Merchant.find({ SAmerchantReferenceNumber: request.user.SAreferenceNumber });

};
const getSAmerchantsCount = async (merchantCount) => {
  return Merchant.find({ SAmerchantReferenceNumber: merchantCount });

};

const getSAmerchantsforAdmin = async (data) => {
  return Merchant.find({ SAmerchantReferenceNumber: data });

};

const searchUsers = async (filter = {}) => {
  filter.role = ROLES.USER;

  return search(filter);
};

const merchantTypes = async () => {
  return MerchantTypes.find();
}

const searchAdmins = async (filter = {}) => {
  filter.role = ROLES.ADMIN;

  return search(filter);
};

const getMerchantStatistics = async () => {
  const webCount = await Merchant.countDocuments({ status: MERCHANT_STATUS.WEB, role: ROLES.MERCHANT });
  const uploadCount = await Merchant.countDocuments({ status: MERCHANT_STATUS.UPLOAD, role: ROLES.MERCHANT });
  const assessedCount = await Merchant.countDocuments({ status: MERCHANT_STATUS.ASSESSED, role: ROLES.MERCHANT });
  const approvedCount = await Merchant.countDocuments({ status: MERCHANT_STATUS.APPROVED, role: ROLES.MERCHANT });
  const integrationCount = await Merchant.countDocuments({ status: MERCHANT_STATUS.INTEGRATION, role: ROLES.MERCHANT });
  const processingCount = await Merchant.countDocuments({ status: MERCHANT_STATUS.PROCESSING, role: ROLES.MERCHANT });

  return {
    web: webCount,
    upload: uploadCount,
    assessed: assessedCount,
    approved: approvedCount,
    integration: integrationCount,
    processing: processingCount
  };
};

const getSAmerchantStatistics = async (request) => {
  const webCount = await Merchant.countDocuments({ SAmerchantReferenceNumber: request.user.SAreferenceNumber, status: MERCHANT_STATUS.WEB, role: ROLES.MERCHANT });
  const uploadCount = await Merchant.countDocuments({ SAmerchantReferenceNumber: request.user.SAreferenceNumber, status: MERCHANT_STATUS.UPLOAD, role: ROLES.MERCHANT });
  const assessedCount = await Merchant.countDocuments({ SAmerchantReferenceNumber: request.user.SAreferenceNumber, status: MERCHANT_STATUS.ASSESSED, role: ROLES.MERCHANT });
  const approvedCount = await Merchant.countDocuments({ SAmerchantReferenceNumber: request.user.SAreferenceNumber, status: MERCHANT_STATUS.APPROVED, role: ROLES.MERCHANT });
  const integrationCount = await Merchant.countDocuments({ SAmerchantReferenceNumber: request.user.SAreferenceNumber, status: MERCHANT_STATUS.INTEGRATION, role: ROLES.MERCHANT });
  const processingCount = await Merchant.countDocuments({ SAmerchantReferenceNumber: request.user.SAreferenceNumber, status: MERCHANT_STATUS.PROCESSING, role: ROLES.MERCHANT });

  return {
    web: webCount,
    upload: uploadCount,
    assessed: assessedCount,
    approved: approvedCount,
    integration: integrationCount,
    processing: processingCount
  };
};

const updateMerchantLiveStatus = async (merchantId) => {
  const merchant = await Merchant.findById(merchantId);
  const merchantDetail = await MerchantDetail.findOne({ merchant: merchantId });

  if (
    merchant
    && merchantDetail
    && merchantDetail.personalInfoStatus === MERCHANT_DETAIL_SECTION_STATUS.APPROVED
    && merchantDetail.additionalInfoStatus === MERCHANT_DETAIL_SECTION_STATUS.APPROVED
    && merchantDetail.processingInfoStatus === MERCHANT_DETAIL_SECTION_STATUS.APPROVED
    && merchantDetail.kycInfoStatus === MERCHANT_DETAIL_SECTION_STATUS.APPROVED
    && merchantDetail.taxInfoStatus === MERCHANT_DETAIL_SECTION_STATUS.APPROVED
    && merchantDetail.bankInfoStatus === MERCHANT_DETAIL_SECTION_STATUS.APPROVED
    && merchantDetail.startupInfoStatus === MERCHANT_DETAIL_SECTION_STATUS.APPROVED
    && merchantDetail.productInfoStatus === MERCHANT_DETAIL_SECTION_STATUS.APPROVED
    && merchantDetail.communicationStatus === MERCHANT_DETAIL_SECTION_STATUS.APPROVED
    && merchantDetail.companyInfoStatus === MERCHANT_DETAIL_SECTION_STATUS.APPROVED
    && merchantDetail.siteInspectionStatus === MERCHANT_DETAIL_SECTION_STATUS.APPROVED
    && merchantDetail.sourceOfSaleStatus === MERCHANT_DETAIL_SECTION_STATUS.APPROVED
  ) {
    merchant.status = MERCHANT_STATUS.PROCESSING;
    await merchant.save();
  }
};

const getMerchantByAPIKey = async (apiKey) => {
  return Merchant.findOne({ apiKey });
};

const updateAPIKey = async (merchantId) => {
  const merchant = await Merchant.findById(merchantId);

  if (!merchant) {
    throw new Error('Not found merchant');
  }

  merchant.apiKey = generateApiKey();
  await merchant.save();

  return merchant;
};

const updateSecretKey = async (merchantId) => {
  const merchant = await Merchant.findById(merchantId);

  if (!merchant) {
    throw new Error('Not found merchant');
  }

  const { publicKey, secretKey } = generateStellarKey();

  merchant.publicKey = publicKey;
  merchant.secretKey = secretKey;
  merchant.apiSecretKey = generateAPISecretKey();

  await merchant.save();

  return merchant;
};

module.exports = {
  searchAdmins,
  searchMerchants,
  getMerchantStatistics,
  updateMerchantLiveStatus,
  merchantTypes,
  getMerchantByAPIKey,
  updateAPIKey,
  updateSecretKey,
  searchSalesAgent,
  getSAmerchants,
  getSAmerchantStatistics,
  getSAmerchantsCount,
  getSAmerchantsforAdmin
}


