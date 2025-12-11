const accounts = require('./accounts');
const payments = require('./payments');
const credit = require('./credit');
const userCredit = require('./userCredit');
const utils = require('./utils');
const exchange = require('./exchange');

module.exports = {
    accounts: accounts,
    payments : payments,
    credit: credit,
    userCredit:userCredit,
    utils : utils,
    exchange: exchange
};
