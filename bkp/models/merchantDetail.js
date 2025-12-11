const mongoose = require('mongoose');
const {
  MERCHANT_DETAIL_SECTION_STATUS,
  MERCHANT_DETAIL_SECTION_STATUS_VALUES,
} = require('../constants/merchantStatus');

const commentSchema = {
  content: {
    type: String,
  },
  userEmail: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
}

const documentSchema = {
  fileName: {
    type: String,
  },
  key: {
    type: String,
  }
}

const schema = new mongoose.Schema({
  merchant: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Merchant'
  },

  // personal information
  firstname: {
      type: String
  },
  lastname: {
      type: String
  },
  country: {
      type: String
  },
  countryCode: {
      type: String
  },
  postalCode: {
      type: String
  },
  personalPhone: {
      type: String,
  },
  fedTaxId:{
    type:String,
  },
  personalInfoComments: {
    type: [commentSchema],
  },
  personalInfoStatus: {
    type: String,
    enum: MERCHANT_DETAIL_SECTION_STATUS_VALUES,
    default: MERCHANT_DETAIL_SECTION_STATUS.PENDING,
  },

  // Additional Company information
  companyDocs: {
    type: [documentSchema]
  },
  additionalCompanyInfoComments: {
    type: [commentSchema],
  },
  dbaComments:{
    type:[commentSchema]
  },
  sourceOfSalesComments:{
    type: [commentSchema]
  },
  additionalInfoStatus: {
    type: String,
    enum: MERCHANT_DETAIL_SECTION_STATUS_VALUES,
    default: MERCHANT_DETAIL_SECTION_STATUS.PENDING,
  },

  // Processing information
  processingInformationComment: {
    type: String
  },
  transactionsMonthlyVolume: {
    type: Number
  },
  transactionsAvgAmount: {
    type: Number
  },
  transactionsHighestValue: {
    type: Number
  },
  seasonalMerchant: {
    type: Boolean
  },
  processingStatement: {
     type: String
  },
  processingSales:{
    type: String
  },
  NDF:{
    type: String
  },
  currentProcessor:{
    type: String
  }, 
  retailChipSwipe:{
    type: String
  },
  imprintCard:{
    type: String
  }, 
  mailPhone:{
    type: Number
  }, 
  internet:{
    type: String
  },
  B2B:{
    type: String
  },
  B2C:{
    type: String
  },
  B2G:{
    type: String
  },
  monthlyVolume:{
    type: String
  },
  AVT:{
    type: String
  }, 
  highTicket:{
    type: String
  }, 
  ebtFns:{
    type: String
  }, 
  emailAsMerchant:{
    type: String
  }, 
  emailAsAdmin:{
    type: String
  },
  processingStatementFiles: {
    type: [documentSchema]
  },
  processingInfoComments: {
    type: [commentSchema]
  },
  communicationComments:{
    type:[commentSchema]
  },
  processingInfoStatus: {
    type: String,
    enum: MERCHANT_DETAIL_SECTION_STATUS_VALUES,
    default: MERCHANT_DETAIL_SECTION_STATUS.PENDING,
  },

  // KYC/KYB
  idDocument: {
    type: documentSchema,
  },
  addressDocument: {
    type: documentSchema,
  },
  taxDocument: {
    type: documentSchema,
  },
  kycInfoComments: {
    type: [commentSchema]
  },
  kycInfoStatus: {
    type: String,
    enum: MERCHANT_DETAIL_SECTION_STATUS_VALUES,
    default: MERCHANT_DETAIL_SECTION_STATUS.PENDING,
  },

  // Tax information
  taxInformationComment: {
    type: String
  },
  federalTaxID: {
    type: String
  },
  stateTaxID: {
    type: String
  },
  abilityToUploadDocuments:{
    type: [documentSchema]
  },
  taxInfoComments: {
    type: [commentSchema]
  },
  taxInfoStatus: {
    type: String,
    enum: MERCHANT_DETAIL_SECTION_STATUS_VALUES,
    default: MERCHANT_DETAIL_SECTION_STATUS.PENDING,
  },
  sourceOfSaleStatus: {
    type: String,
    enum: MERCHANT_DETAIL_SECTION_STATUS_VALUES,
    default: MERCHANT_DETAIL_SECTION_STATUS.PENDING,
  },
  //Dba
  MCC:{
    type:String,
  },
  dbaInfoStatus: {
    type: String,
    enum: MERCHANT_DETAIL_SECTION_STATUS_VALUES,
    default: MERCHANT_DETAIL_SECTION_STATUS.PENDING,
  },
  // Bank information
  bankInformationComment: {
    type: String
  },
  bankName: {
    type: String
  },
  bankAccountName: {
    type: String
  },
  bankCheckingAccount: {
    type: String
  },
  bankRouting: {
    type: String
  },
  bankProcessingStatement: {
    type: String
 },
  bankProcessingStatementFiles: {
    type: [documentSchema]
  },
  bankInfoComments: {
    type: [commentSchema]
  },
  bankInfoStatus: {
    type: String,
    enum: MERCHANT_DETAIL_SECTION_STATUS_VALUES,
    default: MERCHANT_DETAIL_SECTION_STATUS.PENDING,
  },

  // Startup information
  startupInformationComment: {
    type: String
  },
  financialProjectionFile: {
    type: documentSchema,
  },
  businessPlanFile: {
    type: documentSchema
  },
  startUpInfoComments: {
    type: [commentSchema]
  },
  startupInfoStatus: {
    type: String,
    enum: MERCHANT_DETAIL_SECTION_STATUS_VALUES,
    default: MERCHANT_DETAIL_SECTION_STATUS.PENDING,
  },

  // Product/Services offered
  productAndServiceComment: {
    type: String
  },
  mainProducts: {
    type: Object
  },
  salesInitiatedByFF: {
    type: String
  },
  salesInitiatedByOL: {
    type: String
  },
  salesInitiatedByEM: {
    type: String
  },
  salesInitiatedByPH: {
    type: String
  },
  salesInitiatedBySC: {
    type: String
  },
  productDeliver: {
    type: String
  },
  productObligations: {
    type: String
  },
  productDescription: {
    type: String
  },
  refundPolicy: {
    type: String
  },
  dropShipping: {
    type: String
  },
  dropShippingPerc: {
    type: String
  },
  salesComments: {
    type: [commentSchema]
  },
  productServiceComments:{
    type: [commentSchema]
  },
  productInfoStatus: {
    type: String,
    enum: MERCHANT_DETAIL_SECTION_STATUS_VALUES,
    default: MERCHANT_DETAIL_SECTION_STATUS.PENDING,
  },
  communicationStatus: {
    type: String,
    enum: MERCHANT_DETAIL_SECTION_STATUS_VALUES,
    default: MERCHANT_DETAIL_SECTION_STATUS.PENDING,
  },
  // Additional Company Information
  registeredCompanyName: {
    type: String
  },
  tradingName: {
    type: String
  },
  mainBusinessActivity: {
    type: String
  },
  secondaryBusinessActivity: {
    type: String
  },
  companyRegisteredNumber: {
    type: String
  },
  companyType: {
    type: String
  },
  yearsInBusiness: {
    type: Number
  },
  websiteUrl: {
      type: String
  },
  registeredBusinessAddress: {
    type: String
  },
  businessAddressZipcode: {
    type: String
  },
  registeredTradingAddress: {
    type: String
  },
  tradingAddressZipcode: {
    type: String
  },
  companyInfoStatus: {
    type: String,
    enum: MERCHANT_DETAIL_SECTION_STATUS_VALUES,
    default: MERCHANT_DETAIL_SECTION_STATUS.PENDING,
  },


  //siteInspection
  merchantProperty:{
    type:String,
  }, 
  area: {
    type:String,
  }, 
  zoneType:{
    type:String
  }, 
  locationOfInventionary:{
    type:String
  }, 
  inventonaryConsistent:{
    type:String,
  }, 
  locationSurvey:{
    type:String
  },
  doesInsideMatchGoodSold:{
    type:String
  },
  siteInfoComent: {
    type: [commentSchema]
  },
  siteInspectionStatus: {
    type: String,
    enum: MERCHANT_DETAIL_SECTION_STATUS_VALUES,
    default: MERCHANT_DETAIL_SECTION_STATUS.PENDING,
  },
});

module.exports = mongoose.model('MerchantDetail', schema);
