const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const addSchema = new mongoose.Schema({
    id:String,
    url:{
        type:String,
        required:true
    },
    USERNAME:{
        type: String,
        required:true
    },
    Spassword:{
        type:String,
        required:true
    }
})

addSchema.pre("save",async function(next){
    console.log(this._id)
    if(this.isModified("Spassword")){
        this.Spassword = await bcrypt.hash(this.Spassword, 10);
    }
    next()
})

const adddata = mongoose.model('add',addSchema);

module.exports = adddata;