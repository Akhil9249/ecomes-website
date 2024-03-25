const Userdb = require("../models/userModel");

const isSession = async (req, res, next) => {

    if(req.session.isAvailable){
        next()
    }else{
        res.redirect("/login");
    }
};

const isLogin = async (req, res, next) => {

    if(req.session.isAvailable){
        res.redirect("/");
        
    }else{
        next()
    }
};

const sessionRepeat = async (req, res, next) => {

    if(req.session.isAvailable){
        res.redirect("/");
        
    }else{
        next()
    }
};

const isVerified = async (req, res, next) => {

    if(req.session.isAvailable){
    const check = await Userdb.findOne({_id:req.session.isAvailable});
    if(check.isVerified){
        next()
    }else{
        res.redirect("/login");
    }
    }else{
        next()
    }
};






module.exports ={
    isSession,
    isVerified,
    isLogin,
    sessionRepeat
}