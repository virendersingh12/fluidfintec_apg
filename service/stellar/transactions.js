const stellarUtils = require('./utils');

const StellarSdk = require('stellar-sdk');
StellarSdk.Network.use(stellarUtils.getNetwork())
const server = stellarUtils.getServer();

async function getOperationsByHash(hash) {
    return new Promise((resolve, reject) => {
        stellarUtils.getServer().operations()
        .forTransaction(hash)
        .call()
        .then(function (result) {
            resolve(result);
        })
        .catch(
            err => {
                reject(err);
                return {  // fail
                    error: 'error retrieving transaction operations'
                }
            }
        );
    });
}

async function getRecentOperations(accountId) {
    return new Promise((resolve, reject) => {
        server.operations()
            .forAccount(accountId)
            .limit(5)
            .call()
            .then(function (result) {
                resolve(result);
            })
            .catch(
                err => {
                    reject(err);
                    return {  // fail
                        error: 'error retrieving transaction operations'
                    }
                }
            );
    });
}

module.exports = {
    getOperationsByHash,
    getRecentOperations
}
