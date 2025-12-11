const MerchantStellarTransaction = require('../models/merchantStellarTransaction');
const transactions = require('../service/stellar/transactions');
const utils = require('../service/stellar/utils');

const createTransaction = async (txHash, txType) => {
  const res = await transactions.getOperationsByHash(txHash);

  console.log("Create Transaction")

    console.log(res.records)

  const rolling_reserve_amount = 0;//KenRoy//(merchant[0].rolling_reserve_pct * res.records[0].amount) / 100;
  const fee_receivable = 0;//KenRoy (merchant[0].fee_receivable_pct * res.records[0].amount) / 100;
  const bank_fees = (2 * res.records[0].amount) / 100;
  const broker_fee = 0;//KenRoy(merchant[0].broker_fees_payable_pct * res.records[0].amount) / 100;
  const stellarNetwork = utils.getNetwork()._networkPassphrase;

  const valueArray = {
    txId: txHash,
    type: txType,
    asset: res.records[0].asset_code,
    timestamp: res.records[0].created_at,
    network: stellarNetwork,
    merchant_id: 0,//merchant[0].id,
    principal_id: 1,
    primary_amount: res.records[0].amount,
    rolling_reserve_amount: rolling_reserve_amount,
    //merchant[0].rolling_reserve_release_term,
    merchant_fee_receivable_amount: fee_receivable,
    merchant_fee_receivable_date: 0,//merchant[0].fee_receiveable_date,
    acquiring_bank_id: 0,//merchant[0].acquiring_bank_id,
    acquiring_bank_fees_payable_amount: bank_fees,
    acquiring_bank_fees_payable_date: '2020-05-31 13:41:32',
    broker_id: 0,//merchant[0].broker_id,
    broker_fees_payable_amount: broker_fee,
    broker_fees_payable_date: 0,//merchant[0].broker_fees_payable_date,
    rolling_reserve_release_flag: false,
    to_account: res.records[0].to
  }

  const merchantStellarTransaction = await MerchantStellarTransaction.create(
    {to_account: res.records[0].to},
    valueArray
  );

  return merchantStellarTransaction;
};

module.exports = {
  createTransaction,
}
