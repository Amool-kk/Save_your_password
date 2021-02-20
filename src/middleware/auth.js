const jwt = require('jsonwebtoken');
const userdata = require('../models/user');


const auth = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt;

        const varifyUser = jwt.verify(token, process.env.key);

        const user = await userdata.findOne({_id:varifyUser._id});
        
        req.tokenid = token;
        req.user = user;

        // console.log("auth:"+req.tokenid,req.user)

        next()
    } catch (error) {
        res.status(401).redirect("login");
        console.log(error,"here this errror")
    }
}

module.exports = auth;