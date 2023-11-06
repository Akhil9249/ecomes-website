const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true 
    },

    mobile:{
         type:String,
         required:true,
         unique:true
         
    },
    
    password:{ 
        type:String,
        required:true 
    },
    isVerified:Boolean,
    isAdmin:Boolean,
    cart:{
        item:[
            {
                productId:{
                    type:mongoose.Types.ObjectId,
                    ref:'Productdb',
                    required:true
                },
                qty:{
                    type:Number,
                    required:true    
                },   
                price:{
                    type:Number

                },
                singletotal:{
                    type:Number

                }
            }
        ],
        totalPrice :{
            type:Number,
            default:0
        }
    },
    wishlist: {
        item: [{
          productId: {
            type: mongoose.Types.ObjectId,
            ref: 'products',
            required: true
          },
          price: {
            type: Number
          }
        }]
      }

})

const Userdb = mongoose.model('userDB',schema)

module.exports = Userdb;