const mongoose = require("mongoose")

const connectDB = async () =>{
    try{
        const  connection  = await mongoose.connect("mongodb://127.0.0.1:27017/shop");
        console.log("database connected :")
} catch(error){
    console.log(error)
    process.exit(1)
}
}

module.exports = connectDB