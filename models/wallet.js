const mongoose = require('mongoose');

const schema = new mongoose.Schema({

    referralmoney:{
        type:Number,
    },
    wallettotal:{
        type:Number,
    }
})

const Walletdb = mongoose.model('walletDB',schema)

module.exports = Walletdb;