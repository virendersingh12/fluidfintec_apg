const Payee = require('../models/payee');
const Merchant = require('../models/merchant')
const mongoose = require("mongoose");
const createPayee = async (request, result) => {
  const { body, user } = request;
  const params = {
    name: body.name,
    phone: body.phone,
    address: body.address,
    stellarPublicKey: body.stellarPublicKey,
    userId: request.user.id,
  };
  const merchantData = await Merchant.findById(user.id).select('id status email role publicKey apiKey apiSecretKey');
  const paramsMerchant = {
    email: merchantData.email,
  };
  try {
    const PayeeData = await Payee.findOne(params);
    if (PayeeData) throw "Already exists"

    // console.log(PayeeData)
    await Payee.create(params);


    const merchant = await Merchant.aggregate([
      { $match: paramsMerchant },
      {
        $lookup:
        {
          from: "payees",
          localField: "_id",
          foreignField: "userId",
          as: "contacts"
        }
      },
    ]);

    result.json({ result: merchant[0], ok: true });
    // result.status(200).send({ result: "Payee is created", ok: true });
  } catch (err) {
    result.status(400).send({ message: err.message ? err.message : "An error occured when trying to create a new payee or already exist.", ok: false });
  }
};

const userPayee = async (request, result) => {
  const { body } = request;
  const params = {
    userId: mongoose.Types.ObjectId(request.user.id),
  };
  // console.log(params)
  try {
    const PayeeData = await Payee.aggregate([
      { $match: params },
      {
        $lookup:
        {
          from: "merchants",
          localField: "userId",
          foreignField: "_id",
          as: "Payee"
        }
      },
    ]);
    // console.log(PayeeData)
    result.status(200).send({ data: PayeeData });
  } catch (err) {
    result.status(400).send({ message: err.message ? err.message : "An error occured when trying to create a new payee or already exist.", ok: false });
  }
};
module.exports = {
  createPayee,
  userPayee
}
