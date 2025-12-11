const {getMerchantByAPIKey} = require("../repository/merchant.repository");

module.exports = async (req, res, next) => {
    const basicAuth = new Buffer(req.headers.authorization.split(" ")[1], 'base64').toString()

    try{
        const apiKey = basicAuth.split(':')[0]
        const apiSecretKey = basicAuth.split(':')[1]
        const merchant = await getMerchantByAPIKey(apiKey);

        if (merchant && merchant.apiSecretKey === apiSecretKey) {
            req.user = merchant;
            next();
        }else {
            return res.sendStatus(401);
        }
    }catch (e) {
        return res.sendStatus(401);
    }
}
