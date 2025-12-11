const sgMail = require('@sendgrid/mail');
const config = require('config');
const qr = require("qrcode");
var base64ToImage = require('base64-to-image');
const regHTML = require('../templates/registration');
const reviewAccountHtml = require('../templates/reviewAccount');
const merchantStatusUpdatedHtml = require('../templates/merchantStatusUpdated');
const merchantTranactionSuccessfull = require('../templates/merchantTransactionSuccessfull');
const userTransactionSuccess = require('../templates/userTransactionSuccess')
const passwordResetHTML = require('../templates/passwordReset');
const passwordChangedHtml = require('../templates/passwordChanged');
const merchantPoynt = require('../templates/merchantTransactionPoynt')
const merchantPoyntNew = require('../templates/merchantTransactionPoyntNew')


sgMail.setApiKey(config.get('sendgrid.apiKey'));
// sgMail.setApiKey('sendgrid.apiKey');
const sendEmail = async ({ to, from, subject, text, html }) => {
  const msg = { to, from, subject, text, html };
  return sgMail
    .send(msg)
    .then(() => { })
    .catch((err) => console.log('send email error: ', err));
};

const sendMerchantRegistrationEmail = async (email, name, token) => {
  return sendEmail({
    to: email,
    from: 'info@fluidfintec.com',
    subject: 'Fluid Fintec Registration',
    text: `Fluid Fintec`,
    html: regHTML(
      name,
      `${config.get('app.host')}/activate-account?token=${token}`,
    )
  });
};

const sendMerchantPasswordResetEmail = async (email, name, token) => {
  return sendEmail({
    to: email,
    from: 'info@fluidfintec.com',
    subject: 'Fluid Fintec Password Reset',
    text: `Fluid Fintec`,
    html: passwordResetHTML(
      name,
      `${config.get('app.host')}/password-reset?token=${token}`,
    )
  });
};

const sendMerchantPasswordResetSuccessfullyEmail = async (email, name) => {
  return sendEmail({
    to: email,
    from: 'info@fluidfintec.com',
    subject: 'Fluid Fintec Password has been changed',
    text: `Fluid Fintec`,
    html: passwordChangedHtml(
      name,
    )
  });
};

const sendAccountReviewedEmail = async (email, name, reviewer) => {
  return sendEmail({
    to: email,
    from: 'info@fluidfintec.com',
    subject: 'Fluid Fintec Registration',
    text: `Fluid Fintec`,
    html: reviewAccountHtml(
      name,
      reviewer,
    )
  });
};

const sendMerchantStatusUpdatedEmail = async (email, name, status) => {
  return sendEmail({
    to: email,
    from: 'info@fluidfintec.com',
    subject: 'Fluid Fintec Registration',
    text: `Fluid Fintec`,
    html: merchantStatusUpdatedHtml(
      name,
      status,
    )
  });
};

const sendTransactionCompleteMerchant = async (email, userData, transaction, current_time) => {
  const txnID =transaction.transactionId;
  const data = await qr.toDataURL(`https://staging.fluidfintec.com/login`);
  const stellarPublicKey = userData.publicKey;
  const employeeUserId = transaction.employeeUserId;
  const transactionAmount = transaction.transactionAmount/100;
  const orderAmount = transaction.orderAmount/100;
  // const datetime = transaction.createdAt;
  // console.log(data);
  var path = './uploads/';
  var optionalObj = { 'fileName': "qrcode" + Date.now(), 'type': 'png' };

  var imageInfo = base64ToImage(data, path, optionalObj);
  // console.log(config.get('express.host'));
  const url = config.get('express.host') + '/' + imageInfo.fileName;
  const home = config.get('express.host') + '/home.png' ;
  const happy = config.get('express.host') + '/happy.png' ;
  const sad = config.get('express.host') + '/sad.png' ;
  const lock = config.get('express.host') + '/lock.png' ;
  const powered = config.get('express.host') + '/powered.png' ;
  const ZoinLogo = config.get('express.host') + '/ZoinLogo.png';
  // console.log(url);
  if (url) {
    return sendEmail({
      to: email,
      from: 'info@fluidfintec.com',
      subject: 'Fluid Fintec Transaction',
      text: `Fluid Fintec`,
      html: await merchantPoynt(
        url,
        txnID,
        stellarPublicKey,
        employeeUserId,
        transactionAmount,
        orderAmount,
        home,
        happy,
        sad,
        lock,
        powered,
        current_time,
        ZoinLogo
      )
    });
  }
};

const sendTransactionCompleteMerchantNew = async (email, userData, transaction, current_time, product) => {
  const txnID =transaction.transactionId;
  const data = await qr.toDataURL(`https://staging.fluidfintec.com/login`);
  const stellarPublicKey = userData.publicKey;
  const employeeUserId = transaction.employeeUserId;
  const transactionAmount = transaction.transactionAmount/100;
  const orderAmount = transaction.orderAmount/100;
  // const datetime = transaction.createdAt;
  // console.log(data);
  var path = './uploads/';
  var optionalObj = { 'fileName': "qrcode" + Date.now(), 'type': 'png' };

  var imageInfo = base64ToImage(data, path, optionalObj);
  // console.log(config.get('express.host'));
  const url = config.get('express.host') + '/' + imageInfo.fileName;
  const home = config.get('express.host') + '/home.png' ;
  const happy = config.get('express.host') + '/happy.png' ;
  const sad = config.get('express.host') + '/sad.png' ;
  const lock = config.get('express.host') + '/lock.png' ;
  const powered = config.get('express.host') + '/powered.png' ;
  const ZoinLogo = config.get('express.host') + '/ZoinLogo.png';
  // console.log(url);
  if (url) {
    return sendEmail({
      to: email,
      from: 'info@fluidfintec.com',
      subject: 'Fluid Fintec Transaction',
      text: `Fluid Fintec`,
      html: await merchantPoyntNew.transactionMailCatalouge(
        url,
        txnID,
        stellarPublicKey,
        employeeUserId,
        transactionAmount,
        orderAmount,
        home,
        happy,
        sad,
        lock,
        powered,
        current_time,
        ZoinLogo,
        product
      )
    });
  }
};

const sendTransactionCompleteMerchantNew1 = async (email, userData, transaction, current_time, product) => {
  const txnID =transaction.transactionId;
  const data = await qr.toDataURL(`https://staging.fluidfintec.com/login`);
  const stellarPublicKey = userData.publicKey;
  const employeeUserId = transaction.employeeUserId;
  const transactionAmount = transaction.transactionAmount/100;
  const orderAmount = transaction.orderAmount/100;
  // const datetime = transaction.createdAt;
  // console.log(data);
  var path = './uploads/';
  var optionalObj = { 'fileName': "qrcode" + Date.now(), 'type': 'png' };

  var imageInfo = base64ToImage(data, path, optionalObj);
  // console.log(config.get('express.host'));
  const url = config.get('express.host') + '/' + imageInfo.fileName;
  const home = config.get('express.host') + '/home.png' ;
  const happy = config.get('express.host') + '/happy.png' ;
  const sad = config.get('express.host') + '/sad.png' ;
  const lock = config.get('express.host') + '/lock.png' ;
  const powered = config.get('express.host') + '/powered.png' ;
  const ZoinLogo = config.get('express.host') + '/ZoinLogo.png';
  // console.log(url);
  if (url) {
    return sendEmail({
      to: email,
      from: 'info@fluidfintec.com',
      subject: 'Fluid Fintec Transaction',
      text: `Fluid Fintec`,
      html: await merchantPoyntNew.transactionMailCatalouge1(
        url,
        txnID,
        stellarPublicKey,
        employeeUserId,
        transactionAmount,
        orderAmount,
        home,
        happy,
        sad,
        lock,
        powered,
        current_time,
        ZoinLogo,
        product
      )
    });
  }
};

const sendTransactionCompleteUser = async (email, name, status) => {


  const data = await qr.toDataURL(`https://staging.fluidfintec.com/login`);
  console.log(data);
  var path = './uploads/';
  var optionalObj = { 'fileName': "qrcode" + Date.now(), 'type': 'png' };

  var imageInfo = base64ToImage(data, path, optionalObj);
  console.log(config.get('express.host'));
  const url = config.get('express.host') + '/' + imageInfo.fileName;
  if (url) {
    return sendEmail({
      to: email,
      from: 'info@fluidfintec.com',
      subject: 'Fluid Fintec Transaction',
      text: `Fluid Fintec`,
      html: merchantPoynt(
        name,
        status,
        url
      )
    });
  }
};

module.exports = {
  sendMerchantRegistrationEmail,
  sendAccountReviewedEmail,
  sendMerchantStatusUpdatedEmail,
  sendMerchantPasswordResetEmail,
  sendMerchantPasswordResetSuccessfullyEmail,
  sendTransactionCompleteMerchant,
  sendTransactionCompleteUser,
  sendTransactionCompleteMerchantNew,
  sendTransactionCompleteMerchantNew1
};
