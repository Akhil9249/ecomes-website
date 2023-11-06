const Userdb = require("../../models/userModel");

exports.find = (req,res)=>{
    Userdb.find()
    .then((user)=>{
        console.log(user)
        res.send(user);
    })
    .catch((err) => {
        res.status(500).send({ message: err.message || "error occered" });
    });

    
}

