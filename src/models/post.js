const mongoose = require('mongoose');
const Cryptr = require('cryptr');
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId;

cryptr = new Cryptr(process.env.key);

const postSchema = new mongoose.Schema({
    id: {
        type: String
    },
    url: String,
    USERNAME: String,
    Spassword: String
});

postSchema.pre("save",async function(next){
    if(this.isModified("Spassword")){
        this.Spassword = await cryptr.encrypt(this.Spassword)
    }
    next()
})

const add = mongoose.model('add',postSchema);

module.exports = add;