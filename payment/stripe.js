const { stripeCredentials } = require("../config/common.config");
const Strip = require('stripe')(stripeCredentials.secretKey)


var StripePayment = function (userData) {
    console.log(userData);
    this.username = userData.username;
    this.created_at = new Date();
};

// StripePayment.payment = (params, result) => {
//     var data = {};
//     let amount = params.subtotal;
//     let total_amount = amount;
//     let description = ''
//     Strip.charges.create({
//         amount: parseInt(total_amount),
//         currency: 'usd',
//         description: description,
//         source: params.token
//     }, (error, charge) => {
//         if (error) {
//             data['error'] = true;
//             data['msg'] = 'Failed'
//             data['body'] = error
//             result(data);
//         } else {
//             data['error'] = false;
//             data['msg'] = 'Success'
//             data['body'] = charge
//             result(data);
//         }
//     })
// }

StripePayment.payment = (params, result) => {
    var data = {};
    console.log('params******', params)
    let amount = params.total;
    let total_amount = amount;
    let description = ''
    const token = params.token
    Strip.charges.create({
        amount: parseFloat(total_amount * 100),
        currency: 'usd',
        description: description,
        // source: params.id
        source: token.id,
        // customer: params.user_id

    }, (error, charge) => {
        console.log('________________amount', amount);
        console.log('________________source', token);
        if (error) {
            data['error'] = true;
            data['msg'] = 'Failed'
            data['body'] = error
            result(data);
        } else {
            console.log('___charge', charge);
            data['error'] = false;
            data['msg'] = 'Success'
            data['body'] = charge
            result(data);
        }
    })
}

module.exports = StripePayment;