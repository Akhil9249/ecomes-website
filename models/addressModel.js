const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId :{
        type:mongoose.Types.ObjectId,
        ref:'Userdb',
    },
    fullname:{
        type:String,
        uppercase:true,
        required:true
    },
    phone1:{
        type:Number,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    state:{
        type:String,
        required:true
        
    },
    city:{
        type:String,
        required:true
    },
    houseNo:{
        type:String,
        required:true 

    },
    roadName:{
        type:String,
        required:true
    }
})

const Adressdb = mongoose.model('adress',schema)

module.exports = Adressdb;