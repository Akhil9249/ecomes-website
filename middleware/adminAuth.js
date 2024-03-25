const Userdb = require("../models/userModel");

const role = async (req, res, next) => {

    if(req.session.isAvailable){
    const check = await Userdb.findOne({_id:req.session.isAvailable});
    if(check.isAdmin){
        next()
    }else{
        res.redirect("/admin/login");
    }        
    }else{
        res.redirect("/admin/login");
    }
};

module.exports ={
    role
}