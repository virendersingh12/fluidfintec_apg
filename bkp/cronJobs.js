require('./helpers/mongoose').connect();
const { dirname } = require('path');
var CronJob = require('cron').CronJob;

var minus_minutes = function (dt, minutes) {
    return new Date(dt.getTime() - minutes * 60000);
}

const Transaction = require("./models/Transaction");

let poynt = require('poynt')({
    region: 'us',
    applicationId: 'urn:aid:5998f34f-576d-40ff-8550-be776022bcef',
    filename: dirname(require.main.filename) + '/key.pem'
});
var job = new CronJob('*/50 * * * * *', function () {
    const d = new Date();
    let currentTime = d.toISOString();
    console.log(d)
    let startTime = minus_minutes(d, 1);
    console.log(startTime)
    poynt.getTransactions({
        businessId: '3549d1c4-65c7-4348-a1e0-64eba63fa5d0',
        // unsettledOnly: false,
        startAt: startTime.toISOString(),
        endAt: currentTime,
        // storeId: "285294a0-3838-4b12-9ebe-24bf975ddfa3",
    }, async function (err, doc) {
        try {
            if (err) {
                throw err;
            } else {
                console.log(doc)
                let data = [];
                data = (doc.transactions);
                if (data.length) {
                    const filterData = data.filter(function (el) {
                        return el.settled == true;
                    });
                    const dbData = await Transaction.find();
                    console.log(dbData.length)
                    if (filterData.length) {
                        for (let i = dbData.length; i < filterData.length; i++) {

                            const data = await Transaction.findOne({ transactionId: filterData[i].id });
                            if (data) {
                                console.log(data)
                            } else {
                                let StoreData = {
                                    transactionId: filterData[i].id,
                                    employeeUserId: filterData[i].context.employeeUserId,
                                    storeDeviceId: filterData[i].context.storeDeviceId,
                                    businessId: filterData[i].context.businessId,
                                    storeId: filterData[i].context.storeId,
                                    customerLanguage: filterData[i].customerLanguage,
                                    customerOptedNoTip: filterData[i].amounts.customerOptedNoTip,
                                    currency: filterData[i].amounts.currency,
                                    tipAmount: filterData[i].amounts.tipAmount,
                                    transactionAmount: filterData[i].amounts.transactionAmount,
                                    orderAmount: filterData[i].amounts.orderAmount,
                                    status: filterData[i].processorResponse.status,
                                    customerUserId: filterData[i].customerUserId,
                                    cardId: filterData[i].fundingSource.card.cardId,
                                    cardHolderFirstName: filterData[i].fundingSource.card.cardHolderFirstName,
                                    cardHolderLastName: filterData[i].fundingSource.card.cardHolderLastName,
                                    cardNumber: filterData[i].fundingSource.card.numberMasked,
                                    createdAt: filterData[i].createdAt,
                                    updatedAt: filterData[i].updatedAt,
                                }
                                const transactionEntry = await Transaction.create(StoreData);
                                if (transactionEntry) {
                                    console.log(transactionEntry)
                                }
                            }
                        }
                    } else {
                        console.log("No Any data to fetch")
                    }
                } else {
                    console.log("No Any data to fetch");
                }
            }
        } catch (e) {
            console.log(e)
        }

    });
}, null, true, 'America/Los_Angeles');
// job.start();


// console.log('Before job instantiation');
// const job = new CronJob('*/5 * * * * *', function () {
//     const d = new Date();
//     console.log('First:', d);
// });

// console.log('After job instantiation');
job.start();