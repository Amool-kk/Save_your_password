const add = require('../models/add');
const 
const jwt = require('jsonwebtoken');

const auth2 = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        
        const varifyUser = jwt.verify(token, process.env.key);

        const 
    }catch(e){
        console.log(e)
    }
}