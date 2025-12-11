const { dirname } = require('path');
const debug = require('debug');
const error = debug('edex:rout:stell:error');
const log = debug('edex:rout:stell');
const Stellar = require('../service/stellar');
const Merchant = require('../models/merchant');
const Transaction = require('../models/Transaction')

var minus_minutes = function (dt, minutes) {
    return new Date(dt.getTime() - minutes * 60000);
}




const getTransactionWithPagination = async (req, res) => {
    try {
        let poynt = require("poynt")({
            applicationId:
                "urn:aid:5998f34f-576d-40ff-8550-be776022bcef",
            filename: dirname(require.main.filename) + "/key.pem",
        });
        poynt.getTransaction(
            {
                businessId: "3549d1c4-65c7-4348-a1e0-64eba63fa5d0",
                transactionId: "bda4802b-730e-4d98-ad45-50d02f8564be"
            },
            async function (err, doc) {
                if (err) {
                    throw err;
                  }
                  console.log(JSON.stringify(doc));
                return res.status(200).json({data:doc})
            })
    } catch (error) {
        console.log(error);
    }

}

const deleteTransaction = async (req, res)=>{
    const { body = {} } = req;
    const businessId = body.businessId;
    console.log("webhook2 Call", req.body);
    try{
        if(await Transaction.deleteMany({businessId})){
            console.log("done");
            return res
                    .status(200)
                    .send({ message:"Ok" });
        }else{
            return res
                    .status(400)
                    .send({ message:"Not Ok" });
        }
    }catch(e){
        console.log(e)
    }
}

module.exports = {
    getTransactionWithPagination,
    deleteTransaction
};
