const MERCHANT_TYPE = {
  MAMM: 'mamm',
  SHOP: 'shop'
};

const MERCHANT_STATUS = {
  WEB: 'web',
  UPLOAD: 'upload',
  ASSESSED: 'assessed',
  APPROVED: 'approved',
  INTEGRATION: 'integration',
  PROCESSING: 'processing'
};

const MERCHANT_STATUS_TEXT = {
  'web': 'Web applications',
  'upload': 'Information upload stage',
  'assessed': 'Being assessed',
  'approved': 'Approved',
  'integration': 'Website/POS integration Stage',
  'processing': 'Live and Processing',
};

const MERCHANT_STATUS_VALUES = Object.values(MERCHANT_STATUS);

const MERCHANT_DETAIL_SECTION_STATUS = {
  PENDING: 'pending',
  ASSESSED: 'assessed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

const MERCHANT_DETAIL_SECTION_STATUS_VALUES = Object.values(MERCHANT_DETAIL_SECTION_STATUS);

module.exports = {
  MERCHANT_STATUS,
  MERCHANT_STATUS_VALUES,
  MERCHANT_STATUS_TEXT,
  MERCHANT_TYPE,
  MERCHANT_DETAIL_SECTION_STATUS,
  MERCHANT_DETAIL_SECTION_STATUS_VALUES
};
