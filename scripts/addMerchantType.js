const mongoose = require('mongoose');
const config = require('config');

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
)

const MerchantTypes = mongoose.model('MerchantTypes', schema);


mongoose.connect(config.get('mongo.uri'), {
        useCreateIndex: true,
        keepAlive: 1,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    },
    (err) => {
        if (!err) {
            MerchantTypes.insertMany([
                {name: "Convenience Store"},
                {name: "CBD Shop"},
                {name: "Hotel"},
            ]).then(r => {
                console.log("Documents inserted");
            })
        } else {
            console.log(`MongoDB connection error: ${err}`);
        }
    });
