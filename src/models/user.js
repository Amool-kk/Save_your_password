const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const add = require("./post")



const userSchema = new mongoose.Schema({
    username:String,
    useremail:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        
    },
    cpassword:{
        type:String,
    },
    
    tokens:[{
        tokenid:{
            type:String,
            required:true
        }
    }]
})


// for genrate token
userSchema.methods.genrateToken = async function(){
    try{
        const token = await jwt.sign({_id:this._id.toString()}, process.env.key);
        this.tokens = this.tokens.concat({tokenid:token})
        // console.log("token" + this.token)
        return token
    }catch(e){
        console.log(e+"genrate token error")
        res.send(e)
    }
}

// for password hash
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        // console.log(`the current password is ${this.password}`)
        this.password = await bcrypt.hash(this.password, 10);
        // this.Spassword = await bcrypt.hash(this.Spassword, 10);
        // console.log(`the hashed password is ${this.password}`)

        this.cpassword = undefined;
    }

    next();
})

// now we make collection
const userdata = new mongoose.model("userdata", userSchema);

module.exports = userdata;



// data:[{
//     url:String,
//     USERNAME:String,
//     Spassword:String
// }],