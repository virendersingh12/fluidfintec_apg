const StellarSdk = require('stellar-sdk');
const config = require('config');


const ASSETS = {
    'ICE': new StellarSdk.Asset('ICE', config.get('stellar.assets.ICE')),
    'XLM': StellarSdk.Asset.native(),
}

exports.getAssetFromAccount = (account, asset) => {
    const stellar_asset = exports.getAsset(asset);
    return account.balances.find(b => b.asset_code === stellar_asset.code && b.asset_issuer === stellar_asset.issuer)
}

exports.getAsset = (asset) => {
    if (ASSETS[asset]) return ASSETS[asset]
    return StellarSdk.Asset.native()
}

exports.getNetwork = () => {
    return new StellarSdk.Network(config.get('stellar.production') ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET)
}

exports.getServer = () => {
    return new StellarSdk.Server(config.get('stellar.network'));
}
