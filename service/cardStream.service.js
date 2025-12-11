const debug = require('debug');
const error = debug('cards:tx:error');
const log = debug('cards:tx');
const mongoose = require('mongoose');
const hash = require('crypto');
const config = require('config');
const CardstreamTx = require('../models/cardsteamTx');
const Merchant = require('../models/merchant');
const { updateMerchantLiveStatus } = require('../repository/merchant.repository');
const stellarService = require('../service/stellar');
const { MERCHANT_TYPE } = require('../constants/merchantStatus');

const ObjectId = mongoose.Types.ObjectId;

const CUR_TO_ASSET = {
  // 'EUR': 'ICET',
  // 'GBP': 'ECPS',
  'USD': 'ICE'
};

const CURRENCY_CODES = {
  EUR: 978,
  USD: 840,
  GBP: 826
};

const RESPONSE_CODES = {
  0: 'Successful / authorised transaction.',
  2: 'Card referred.',
  4: 'Card declined – keep card.',
  5: 'Card declined.'
};

const setupFields = (details) => {
  const testFields = {
    cardCVV: 689,
    cardExpiryMonth: 12,
    cardExpiryYear: 21,
    cardNumber: 4543059999999990,
    customerAddress: '23 Rogerham Mansions 4578 Ermine Street Borehamwood',
    customerName: 'CardStream',
    customerPhone: '004408450099575',
    customerPostCode: 'WD54 8TH',
  };

  let redirectURL = config.get('client.mamm.redirectUrl');
  if (details.hasOwnProperty('merchantType')) {
    const merchantType = details.merchantType;
    if (merchantType === MERCHANT_TYPE.SHOP) {
      redirectURL = config.get('client.shop.redirectUrl');
    }
  }

  const requiredFields = {
    action: 'SALE',
    amount: parseInt(details.amount.replace('.', ''), 10),
    countryCode: 826,
    currencyCode: CURRENCY_CODES[details.currency],
    merchantID: 121059,
    //KenRoy
    redirectURL: redirectURL,
    type: 1,
    callbackURL: `${config.get('express.host')}/api/card/callback`
  };

  console.log("requiredFields = ");
  console.log(requiredFields);

  return config.get('production') ? requiredFields : { ...requiredFields, ...testFields };
};

const purchase = async (request, result) => {
  const tx_id = new ObjectId;

  console.log("PURCHASE!!!!");
  const fields = {
    ...setupFields(request.body),
    orderRef: tx_id
  };
  const items = Object.keys(fields);
  let string = '';
  items.sort();
  items.forEach((item) => {
    string += item + '=' + encodeURIComponent(fields[item]) + '&'
  });

  string = string.slice(0, -1);
  string = string.replace(/\(/g, '%28');
  string = string.replace(/\)/g, '%29');
  string = string.replace(/%20/g, '+');

  const signature = hash
    .createHash('SHA512')
    .update(string + config.get('cardstream.preshared_key'))
    .digest('hex');

  const data = {
    ...fields,
    signature: signature
  };

  console.log("cardstream_tx.newTransaction!!!!!");

  await CardstreamTx.create({
    request: data,
    amount: request.body.amount,
    currency: request.body.currency,
    asset: CUR_TO_ASSET[request.body.currency],
    merchant: request.user.id,
    _id: tx_id
  });

  await updateMerchantLiveStatus(request.user.id);

  return data;
};

const callback = (request, result) => {
  return Promise.resolve({});
};

const txHasError = (tx) => tx.response.responseCode !== '0';

const getTxError = (tx) => {
  console.log("Error = ", RESPONSE_CODES[tx.response.responseStatus])
  return {
    error: RESPONSE_CODES[tx.response.responseStatus]
  }
};

const creditAccount = (merchant, tx) => {
  console.log("CardStream Transaction");
  let opts = {
    to_account: merchant.publicKey,
    asset: tx.asset,
    amount: tx.amount
  };
  console.log(opts);
  let res = stellarService.credit.creditAccount(opts);
  console.log(res);
  console.log("CardStream Transaction before return");
  return res;
};

// could be used with callback function as fallback
const handlePaymentResponse = (response) => {
  return CardstreamTx.findByIdAndUpdate(response.orderRef, { response: response }, { new: true })
    .then((tx) => Merchant.findById(tx.merchant).then(merchant => { return [merchant, tx]; }))
    .then(([merchant, tx]) => {
      console.log("handlePaymentResponse!!!!! 1");
      if (txHasError(tx)) {
        console.log("handlePaymentResponse!!!!! 2");
        return getTxError(tx)
      } else {
        return creditAccount(merchant, tx)
          .then(res => {
            console.log("handlePaymentResponse!!!!! 3");
            return CardstreamTx.findByIdAndUpdate(tx.id, { 'stellar_tx': res });
          })
          .then(res => {
            console.log("handlePaymentResponse!!!!! 4");
            return { // success
              error: false,
              tx_id: response.orderRef,
              tx_hash: res.stellar_tx.hash
            }
          })
          .catch(
            err => {
              console.log("handlePaymentResponse!!!!! 5");
              error(err);
              return { // fail
                error: 'error processing payment'
              }
            }
          )
      }
    });
};

const redirect = (request, result) => {
  console.log(request.body);
  const response = request.body;
  return handlePaymentResponse(response);
};

module.exports = {
  redirect: redirect,
  purchase: purchase,
  callback: callback
};

/*
 *  EXAMPLE SUCCESS
 */

/*
{ responseStatus: '1',
  responseMessage: 'CARD REFERRED',
  responseStatus: '1',
  merchantID: '114698',
  threeDSEnabled: 'Y',
  avscv2CheckEnabled: 'Y',
  riskCheckEnabled: 'N',
  caEnabled: 'Y',
  rtsEnabled: 'Y',
  cftEnabled: 'N',
  resellerGatewayUrl: 'https://gateway.cardstream.com/hosted/',
  eReceiptsEnabled: 'N',
  surchargeEnabled: 'N',
  transactionID: '35057691',
  xref: '19030612PR27DM53KV34RVH',
  state: 'referred',
  redirectURL: 'https://edexpay.net',
  callbackURL: 'https://dev.edexpay.net/api/card/callback',
  remoteAddress: '176.61.44.39',
  action: 'SALE',
  type: '1',
  currencyCode: '978',
  countryCode: '826',
  amount: '5000',
  currencyExponent: '2',
  paymentMethod: 'card',
  cardTypeCode: 'VC',
  cardNumberMask: '454305******9990',
  cardExpiryDate: '1219',
  cardExpiryMonth: '12',
  cardExpiryYear: '19',
  customerName: 'CardStream',
  customerAddress: '23 Rogerham Mansions 4578 Ermine Street Borehamwood',
  customerPostcode: 'WD54 8TH',
  customerPhone: '004408450099575',
  eReceiptsStoreID: '1',
  customerReceiptsRequired: 'N',
  cv2CheckPref:
   'not known,not checked,matched,not matched,partially matched',
  addressCheckPref:
   'not known,not checked,matched,not matched,partially matched',
  postcodeCheckPref:
   'not known,not checked,matched,not matched,partially matched',
  threeDSCheckPref:
   'not known,not checked,authenticated,not authenticated,attempted authentication',
  threeDSXID: 'MDAwMDAwMDAwMDAwMzUwNTc2OTE=',
  threeDSEnrolled: 'Y',
  threeDSACSURL: 'https://acs.3ds-pit.com/',
  threeDSPaReq:
   'eJxVUdtuwjAM/ZWKp+2lSUsDBJlI5SKNBxhi5QNCakaltYU0XWFfv4TSMSxF8vHl\r\n2DmG5KgR5x+oao0CVlhV8hO9LJ30mBoe9kpxdpBp1BOwibd4FvCNusrKQgQ+9UMg\r\nHbStWh1lYQRIdZ4u1yII+xEbALlDyFEv54Ja49w2thAKmaOYZmZW772XBCvjxUqV\r\ndWFegdxycEP6KkahJesA1PpLHI05VWNCmqbxldRpZTTK3FdlToC4AiCPrTa18ypL\r\neMlSsZrHzdP72TXrRIXvyWICxFVAKg2KkAac9unAC8JxOByzCMgtDjJ3m4jFbusx\r\n6lNq/9lG4OQGxS1g1GX+R8AKrbFQV8GHI/ufDgFeTmWBtsJq8+cDeaw9e3PSKmNV\r\ni1jUp4x35oa3CceSWXkCHrQ0DgBxreR+P3K/sfWebv8Lz3Krhg==',
  threeDSPaRes:
   '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',
  threeDSResponseCode: '0',
  threeDSResponseMessage: 'Success',
  threeDSVETimestamp: '2019-03-06 12:27:53',
  threeDSCheck: 'authenticated',
  requestMerchantID: '114698',
  processMerchantID: '114698',
  cardType: 'Visa Credit',
  cardScheme: 'Visa ',
  cardSchemeCode: 'VC',
  cardIssuer: 'THE ROYAL BANK OF SCOTLAND PLC',
  cardIssuerCountry: 'United Kingdom',
  cardIssuerCountryCode: 'GBR',
  cardFlags: '8323072',
  cardNumberValid: 'Y',
  vcsResponseCode: '0',
  vcsResponseMessage: 'Success - no velocity check rules applied',
  cardCVVMandatory: 'Y',
  requestID: '5c7fbcc8aeef0',
  threeDSAuthenticated: 'Y',
  threeDSECI: '05',
  threeDSCAVV: 'M0RTUElULUFDQ0VTU0NPTlRST0w=',
  threeDSCAVVAlgorithm: '2',
  avscv2ResponseCode: '222100',
  avscv2ResponseMessage: 'ALL MATCH',
  avscv2AuthEntity: 'merchant host',
  cv2Check: 'matched',
  addressCheck: 'matched',
  postcodeCheck: 'matched',
  threeDSCATimestamp: '2019-03-06 12:28:06',
  timestamp: '2019-03-06 12:28:06',
  amountRetained: '0',
  customerPostCode: 'WD54 8TH',
  customerNameMandatory: 'Y',
  cardExpiryDateMandatory: 'Y',
  displayAmount: 'EUR 50.00',
  signature:
   'be59d426ffe98c79225531e17fe7a1e1b4ce97c1c5598e09e4a293af334e56ffb29bc8ca63af509bd4ac62ef71d5cf7fb1dea82e3a06f45dc54a8c5bd5212958' }
*/
