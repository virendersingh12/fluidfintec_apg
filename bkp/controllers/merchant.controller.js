const Merchant = require('../models/merchant');
const MerchantDetail = require('../models/merchantDetail');
const MerchantTypes = require('../models/merchantTypes');
const qr = require("qrcode");
const merchantService = require('../service/merchant.service');
const merchantRepository = require('../repository/merchant.repository');
const { ROLES } = require('../constants/userRoles');
const { MERCHANT_DETAIL_SECTION_STATUS } = require('../constants/merchantStatus');

const createMerchant = async (request, result) => {
  const { body } = request;
  const params = {
    email: body.signupEmail,
    password: body.signupPassword,
    contactName: body.signupContactName,
    companyName: body.signupCompanyName,
    phoneNumberCall: body.signupPhoneNumberCall,
    phoneNumberSMS: body.signupPhoneNumberSMS,
    einNumber: body.einNumber,
    offerCode: body.offerCode
  };

  try {
    await merchantService.createNewPendingUser(params, params.password);
    console.log(params, params.password)
    result.status(200).send({ result: "A new pending account has been created.", ok: true });
  } catch (err) {
    result.status(400).send({ message: err.message ? err.message : "An error occured when trying to create a new pending merchant account.", ok: false });
  }
};

const createMerchantType = async (request, result) => {
  const { name } = request.body;
  const params = {
    name: name,
  };

  try {
    if (name) {
      console.log(name)
      if (await MerchantTypes.findOne(params)) {
        throw 'Already exist'
      } else {
        const data = await MerchantTypes.create(params);
        result.status(200).send({ result: "Merchant type created", ok: true, data });
      }
    } else {
      throw 'Name field is required'
    }
  } catch (err) {
    result.status(400).send({ message: err.message ? err.message : err, ok: false });
  }
};

const getMerchants = async (request, result) => {
  const { query = {} } = request;
  try {
    const merchants = await merchantRepository.searchMerchants(query);
    return result.status(200).send({ result: merchants, ok: true });
  } catch (err) {
    return result.status(400).send({
      message: err.message ? err.message : "An error occurred when trying to search merchants",
      ok: false
    });
  }
};

const getMerchantTypes = async (request, result) => {
  try {
    const types = await merchantRepository.merchantTypes();
    return result.status(200).send({ result: types, ok: true });
  } catch (err) {
    return result.status(400).send({
      message: err.message ? err.message : "An error occurred when trying to get merchant types",
      ok: false
    });
  }
};

const updateMerchantDetail = async (req, res) => {
  const { params, body, user } = req;

  const { sectionField } = body;
  let updates = { ...body }
  if (sectionField && user.role === ROLES.MERCHANT) {
    updates = {
      ...updates,
      [sectionField]: MERCHANT_DETAIL_SECTION_STATUS.PENDING,
    };
  }

  try {
    await Merchant.findOneAndUpdate({ _id: params.id }, updates);
    const merchantDetail = await MerchantDetail.findOneAndUpdate(
      { merchant: params.id },
      updates,
      { upsert: true, new: true },
    ).populate({ path: 'merchant', select: '_id email contactName role companyName einNumber offerCode phoneNumberCall phoneNumberSMS status publicKey apiKey apiSecretKey businessId applicationId applicationIdkey' });

    return res.status(200).send({ result: merchantDetail, ok: true });
  } catch (err) {
    return res.status(400).send({ message: err.message ? err.message : "An error occured when trying to create a new pending merchant account.", ok: false });
  }
};

const approveMerchant = async (req, res) => {
  const { params } = req;

  try {
    const result = await merchantService.approve(params.id);
    return res.status(200).send({ result, ok: true });
  } catch (err) {
    return res.status(400).send({ message: err.message ? err.message : "An error occured when trying to create a new pending merchant account.", ok: false });
  }
};

const getMerchantDetail = async (req, res) => {
  const { params } = req;
  let merchantDetail= {};
  try {
    merchantDetail = await MerchantDetail.findOne(
      { merchant: params.id },
    ).populate({ path: 'merchant', select: '_id email role companyName phoneNumberCall phoneNumberSMS einNumber offerCode status publicKey apiSecretKey apiKey contactName businessId applicationId applicationIdkey' });
   if(merchantDetail){
     const {publicKey} =merchantDetail.merchant;
     if(publicKey){
      const qrCode = await qr.toDataURL(publicKey);
      if(qrCode){
        
        return res.status(200).send({ result: {...merchantDetail.toJSON(),qrCode}, ok: true });
      }
      
     }else{
      return res.status(200).send({ result: merchantDetail, ok: true });
     }
   }else{
    return res.status(400).send({ result: "no merchant", ok: false });
   }
    
  } catch (err) {
    return res.status(400).send({ message: err.message ? err.message : "An error occured when trying to create a new pending merchant account.", ok: false });
  }
};

const addComment = async (req, res) => {
  const { params, body, user } = req;
  const { commentType, content } = body;

  try {
    const result = await merchantService.addComment(
      params.id,
      commentType,
      content,
      user
    );

    return res.status(200).send({ result, ok: true });
  } catch (err) {
    return res.status(400).send({ message: err.message ? err.message : "An error occured when trying to add comment.", ok: false });
  }
};

const createAdmin = async (req, res) => {
  const { body } = req;

  const merchantData = {
    email: body.signupEmail,
    password: body.signupPassword,
    contactName: body.signupContactName,
    companyName: body.signupCompanyName,
    phoneNumberCall: body.signupPhoneNumberCall,
    phoneNumberSMS: body.signupPhoneNumberSMS,
    role: ROLES.ADMIN,
  };

  try {
    await merchantService.createNewPendingUser(merchantData, merchantData.password, ROLES.ADMIN);
    return res.status(200).send({ result: "A new pending account has been created.", ok: true });
  } catch (err) {
    return res.status(400).send({ message: err.message ? err.message : "An error occurred when trying to create a new pending merchant account.", ok: false });
  }
};

const getAdmins = async (req, res) => {
  const { query = {} } = req;

  try {
    const merchants = await merchantRepository.searchAdmins(query);
    return res.status(200).send({ result: merchants, ok: true });
  } catch (err) {
    return res.status(400).send({ message: err.message ? err.message : "An error occurred when trying to search admins", ok: false });
  }
};

const deleteAdmin = async (req, res) => {
  const { params } = req;
  console.log(params)

  try {
    await Merchant.findByIdAndDelete(params.id);
    return res.status(200).send({ ok: true });
  } catch (err) {
    return res.status(400).send({ message: err.message ? err.message : "An error occurred while trying to remove admin.", ok: false });
  }
};

const deleteMerchant = async (req, res) => {
  const { params } = req;

  try {
    await Merchant.findByIdAndDelete(params.id);
    return res.status(200).send({ ok: true });
  } catch (err) {
    return res.status(400).send({ message: err.message ? err.message : "An error occurred while trying to remove admin.", ok: false });
  }
};

const deactivteMerchant = async (req, res) => {
  const { params } = req;
  console.log(params,"params")

  try {
    await Merchant.findByIdAndUpdate(params.id,{isDeleted:true}).then(res=>{
      console.log('updated',res)
    }).catch(error=>{
      console.log(error,"err")
    });
    return res.status(200).send({ ok: true });
  } catch (err) {
    return res.status(400).send({ message: err.message ? err.message : "An error occurred while trying to deactivate merchant.", ok: false });
  }
};

const activteMerchant = async (req, res) => {
  const { body } = req;
  console.log(body,"params")

  try {
    const merchantAccount = await Merchant.findById(body.id);
    const anyMerchantWithSameEmail = await Merchant.findOne({email:merchantAccount.email, isDeleted:false});
    if(anyMerchantWithSameEmail){
      throw 'User already exist';
    }else{
      await Merchant.findByIdAndUpdate(body.id,{isDeleted:false}).then(res=>{
        console.log('updated',res)
      }).catch(error=>{
        console.log(error,"err")
      });
      return res.status(200).send({ ok: true });
    }
    
  } catch (err) {
    return res.status(400).send({ message: err.message ? err.message : "An error occurred while trying to activate merchant.", ok: false });
  }
};

const updateAdmin = async (req, res) => {
  const { body = {}, params = {} } = req;
  const { id } = params;

  const updatedBody = {
    email: body.signupEmail,
    phone: body.signupPassword,
    contactName: body.signupContactName,
    companyName: body.signupCompanyName,
    phoneNumberCall: body.signupPhoneNumberCall,
    phoneNumberSMS: body.signupPhoneNumberSMS,
  };

  try {
    const merchant = await Merchant.findByIdAndUpdate(id, updatedBody);
    return res.status(200).send({ result: merchant, ok: true });
  } catch (err) {
    return res.status(400).send({ message: err.message ? err.message : "An error occurred while trying to update admin.", ok: false });
  }
};

const getStatistics = async (req, res) => {
  try {
    const result = await merchantRepository.getMerchantStatistics();
    return res.status(200).send({
      ok: true,
      result
    });
  } catch (err) {
    return res.status(400).send({ message: err.message ? err.message : "An error occurred while trying to get merchant statistics.", ok: false });
  }
};

const approveSection = async (req, res) => {
  const { body = {}, params } = req;
  const { field, approved } = body;

  try {
    const merchantDetail = await MerchantDetail.findOneAndUpdate(
      { merchant: params.id },
      { [field]: approved ? MERCHANT_DETAIL_SECTION_STATUS.APPROVED : MERCHANT_DETAIL_SECTION_STATUS.REJECTED },
      { upsert: true, new: true }
    ).populate({ path: 'merchant', select: '_id email companyName role phoneNumberCall phoneNumberSMS einNumber offerCode status businessId applicationId applicationIdkey' });

    return res.status(200).send({ result: merchantDetail, ok: true });
  } catch (err) {
    return res.status(400).send({ message: err.message || 'An error occurred while trying to review merchant detail section', ok: false });
  }
}

const assessingSection = async (req, res) => {
  const { body = {}, params } = req;
  const { field } = body;

  try {
    const merchantDetail = await MerchantDetail.findOneAndUpdate(
      { merchant: params.id },
      { [field]: MERCHANT_DETAIL_SECTION_STATUS.ASSESSED },
      { upsert: true, new: true }
    ).populate({ path: 'merchant', select: '_id email companyName phoneNumberCall role phoneNumberSMS einNumber offerCode status businessId applicationId applicationIdkey' });

    return res.status(200).send({ result: merchantDetail, ok: true });
  } catch (err) {
    return res.status(400).send({ message: err.message || 'An error occurred while trying to review merchant detail section', ok: false });
  }
}

const updateAPIKey = async (req, res) => {
  const { id } = req.params;

  try {
    const merchant = await merchantRepository.updateAPIKey(id);
    return res.status(200).send({ result: merchant, ok: true });
  } catch (err) {
    return res.status(400).send({ message: err.message || 'An error is occurred while updating API Key', ok: false });
  }
};

const updateSecretKey = async (req, res) => {
  const { id } = req.params;

  try {
    const merchant = await merchantRepository.updateSecretKey(id);
    return res.status(200).send({ result: merchant, ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message || 'An error is occurred while updating Secret Key', ok: false });
  }
};

module.exports = {
  createMerchant,
  createMerchantType,
  getMerchants,
  updateMerchantDetail,
  getMerchantDetail,
  addComment,
  createAdmin,
  getAdmins,
  deleteAdmin,
  deleteMerchant,
  deactivteMerchant,
  activteMerchant,
  updateAdmin,
  getStatistics,
  approveMerchant,
  approveSection,
  assessingSection,
  updateAPIKey,
  updateSecretKey,
  getMerchantTypes,
}
