const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    category:{   
        type:String,
        // required:true
    },

    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    
    description:{
        type:String,
        // required:true
    },

    image:{
        type:Array,
     },
     isAvailable:{
        type:Boolean,
        default:true
    }
},{timestamps : true})

const Productdb = mongoose.model('producDB',schema)

module.exports = Productdb;