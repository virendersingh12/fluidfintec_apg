const uuid = require('uuid');
const UIDGenerator = require('uid-generator');
const StellarSdk = require('stellar-sdk');
const crypto = require("crypto");

const UIDBase62Char16 = new UIDGenerator(UIDGenerator.BASE62, 16);
const UIDBase62Char32 = new UIDGenerator(UIDGenerator.BASE62, 32);

const generateApiKey = () => {
  let rnd = uuid.v4();
  rnd = rnd.replace(/-/g, '');
  return rnd.substr(0, 4) + '-' + rnd.substr(4, 4) + '-' + rnd.substr(8, 5) + '-' + rnd.substr(13, 4);
};

const generateAPISecretKey = () => {
    return crypto.randomBytes(30).toString('hex').toUpperCase();
}

const generateStellarKey = () => {
  const primaryKP = StellarSdk.Keypair.random();
  const publicKey = primaryKP.publicKey();
  const secretKey = primaryKP.secret();

  return {
    publicKey,
    secretKey,
  }
}

const generateToken = () => {
  return UIDBase62Char16.generateSync()
}

const generateRandomString = (length = 21) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charLen = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charLen));
  }
  return result;
};

module.exports = {
  generateApiKey,
  generateToken,
  generateRandomString,
  generateStellarKey,
  generateAPISecretKey
};
