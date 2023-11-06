const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        uppercase:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    isAvailable:{
        type:Number,
        default:1
    }
})

const Categorydb = mongoose.model('categoryDB',schema)

module.exports = Categorydb;