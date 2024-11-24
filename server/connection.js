const mongoose = require("mongoose")

const connectDB = async () =>{
    try{
        const  connection  = await mongoose.connect("mongodb://127.0.0.1:27017/shop");  
        // const  connection  = await mongoose.connect("mongodb+srv://akhilcv430:fiwRFJJXvV3RlK2e@cluster0.srijh4k.mongodb.net/smart-shop");
        console.log("database connected :")
} catch(error){
    console.log(error)
    process.exit(1)
}
}

module.exports = connectDB
