const bcrypt = require("bcrypt");
const User = require("../models/Users");
const Merchant = require('../models/merchant')
const stellar = require("./stellar");
// const Token = require("../models/token");
const {
    generateApiKey,
    generateStellarKey,
    // generateToken,
    generateAPISecretKey,
} = require("../helpers/apiKeyFuncs");
// const { TOKEN_TYPE } = require("../constants/tokenType");

const createHash = async (value) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(value, 15, function (err, hash) {
            if (err) reject(err);
            resolve(hash);
        });
    });
};

const createUser = async (data, user_password) => {
    try {
        const promise = new Promise(async (resolve, reject) => {

            const MerchantData = await Merchant.findOne({ email: data.email });
            console.log(MerchantData)
            if (!MerchantData) {
                const userPassword = await createHash(user_password);

                const { publicKey, secretKey } = generateStellarKey();
                const apiKey = generateApiKey();
                const apiSecretKey = generateAPISecretKey();

                const newUser = {
                    ...data,
                    apiKey: apiKey || "",
                    secretKey: secretKey || "",
                    publicKey: publicKey || "",
                    apiSecretKey: apiSecretKey || "",
                    password: userPassword,
                    role: "User",
                    isActivated: true
                };
                const singleUser = await Merchant.create(newUser);
                // const token = await Token.create({
                //     token: generateToken(),
                //     merchant: singleUser.id,
                //     type: TOKEN_TYPE.ACTIVATE_ACCOUNT,
                //     expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                //     blacklisted: false,
                // });
                if (singleUser) {
                    await stellar.accounts.initialiseAccount(secretKey)
                    resolve(singleUser);

                }
            }else{
                resolve(MerchantData);
            }
        });
      return await promise.then(data => { return data }).catch(err => { throw err })
    } catch (error) {
        reject(error);
    }

};

module.exports = {
    createUser,
};
