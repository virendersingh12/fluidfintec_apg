const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    stellarPublicKey: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },

   
});

module.exports = mongoose.model("Payee", schema);
