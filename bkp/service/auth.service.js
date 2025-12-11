const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const tokenService = require('../service/token.service');
const Token = require('../models/token');
const { TOKEN_TYPE } = require('../constants/tokenType');
const Merchant = require('../models/merchant');

const userFields = '_id status email password role';

const loginEmail = (email, password) => {
    console.log("loginEmail!!!!!");
    return new Promise(async (resolve, reject) => {
        const user = await Merchant.findOne({ email, isDeleted: false });
        console.log(user);
       
       
        if (user) {
            const params = {
                _id:user._id,
              };
            if (!user.isActivated) {
                reject('User is not activated.');
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if (passwordCompare) {
                delete user._doc.password;

                const token = await tokenService.generateAuthToken(user);
                const PayeeData = await Merchant.aggregate([
                    { $match : params },
                    {$lookup:
                        {
                           from: "payees",
                           localField: "_id",
                           foreignField: "userId",
                           as: "contacts"
                        }
                    },
                  ]);
                  const data = PayeeData[0];
                resolve({
                    token,
                    user:data,
                });
            } else {
                reject('password incorrect')
            }
        } else {
            reject('email not found')
        }
    });
};

const getToken = async (refreshToken) => {
    const token = await Token.findOne({ token: refreshToken, type: TOKEN_TYPE.REFRESH });
    if (!token) {
        throw new Error('Token is not exist!');
    }

    const decodedToken = jwt.verify(token.token, config.get('jwt.refresh_token_secret'));
    if (decodedToken.exp < Math.trunc(Date.now() / 1000)) {
        throw new Error('Token is expired!');
    }

    const user = await Merchant.findById(decodedToken.id).select(userFields);
    if (!user) {
        throw new Error('Cannot find user!')
    }

    const newRefreshToken = tokenService.generateRefreshJWT(user);
    const newToken = tokenService.generateJWT(user);

    token.token = newRefreshToken;
    await token.save();

    return {
        token: {
            ...newToken,
            refreshToken: newRefreshToken
        },
        user
    };
};

module.exports = {
    loginEmail,
    getToken
}
