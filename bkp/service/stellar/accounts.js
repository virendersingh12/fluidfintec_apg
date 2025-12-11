const debug = require('debug');
const error = debug('edex:stell:acc:error');
const log = debug('edex:stell:acc');
const utils = require('./utils');
const config = require('config');
const axios = require('axios');

const StellarSdk = require('stellar-sdk');
console.log(StellarSdk.Network)
StellarSdk.Network.use(utils.getNetwork())
const server = utils.getServer();

exports.initialiseAccount = async (secret) => {

  // let op_keypair = StellarSdk.Keypair.fromSecret(config.get('stellar.operations'))
  let ac_keypair = StellarSdk.Keypair.fromSecret(secret)

  // let assets = []
  // let start_balance = 0.5;

  // Object.keys(config.get('stellar.assets')).forEach(function(key) {
  //     assets.push(new StellarSdk.Asset(key, config.get('stellar.assets')[key]))
  //     start_balance += 0.5
  // });


  const response = await axios.get(
    `https://friendbot.stellar.org?addr=${encodeURIComponent(
      ac_keypair.publicKey(),
    )}`,
  );
  //   const responseJSON = await response.json();
  console.log(response);
  return response;
  // return("SUCCESS! You have a new account :)\n", response.data);

  // if(response.status==200){

  // return server.loadAccount(ac_keypair.publicKey())
  // .then(account => { 
  //     // console.log("Here new account",account); 
  //     return account; })
  // .then(
  //     account => {

  //         let transaction = new StellarSdk.TransactionBuilder(account)
  //         // console.log("here", transaction)
  //         // create account
  //         transaction.addOperation(
  //             StellarSdk.Operation.createAccount({
  //                 destination: ac_keypair.publicKey(),
  //                 startingBalance: start_balance.toFixed(7)
  //             })
  //         );

  //         // set trustlines
  //         for (var a=0; a<assets.length; a++){
  //             transaction.addOperation(
  //                 StellarSdk.Operation.changeTrust({
  //                     asset: assets[a],
  //                     source: ac_keypair.publicKey()
  //                 })
  //             )
  //         }

  //         let tx = transaction.build();
  //         // sign with both
  //         tx.sign(op_keypair, ac_keypair)

  //         console.log("tx build ",tx)
  //         return server.submitTransaction(tx)
  //         .then(
  //             res => {
  //                 log('Success! Account Initialised');
  //                 log(res)
  //             },
  //             err => {
  //                 error(err['response']['data']['extras']['result_codes']);
  //                 throw err
  //             }
  //         )
  //     }

  // );
  //   }
}
