const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/crypto",{
    useCreateIndex:true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log(`Connection is done with mongodb`);
}).catch((e)=>{
    console.log(e);
})