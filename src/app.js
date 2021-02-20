const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const Cryptr = require('cryptr')
const cookie = require('cookie-parser');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const mongoClient = require('mongodb').MongoClient()


require("./db/conn");
const userdata = require("./models/user");
const auth = require("./middleware/auth");



cryptr = new Cryptr(process.env.key)


const port = process.env.PORT || 3000;

const app = express()

app.use(express.json())
app.use(cookie());
app.use(express.urlencoded({ extended: false }))

const static_path = path.join(__dirname, "../public")
const views_path = path.join(__dirname, "../views");
app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", views_path);

// some functions
const getdata = async (email) => {
    // for add data
    try {
        app.post('/data-post', async (req, res) => {
            try {
                // const id = await req.user._id
                // console.log(id, "in side of post")
                // const Spassword = await bcrypt.hash(req.body.Spassword, 10)
                const Spassword = await cryptr.encrypt(req.body.Spassword)
                const signeddata = await userdata.find({ useremail: email })
                // console.log(signeddata)
                if(req.body.url != ""&& req.body.USERNAME != ""&& req.body.Spassword != ""){
                    const updateData = await userdata.updateOne(
                        { useremail: email },
                        {
                            $push: {
                                data: [{
                                    url: req.body.url,
                                    USERNAME: req.body.USERNAME,
                                    Spassword: Spassword
                                }]
                            }
                        }
                    );
                    res.status(201).redirect("/")
    
                }else{
                    const error = "Fill these entery"
                    res.status(201).redirect('/')
                }
                
                
            } catch (e) {
                console.log(`error in add post ${e}`)
            }

        })
        
    } catch (error) {
        console.log(error)
    }

    // for delete 
    app.post('/Delete',async (req, res) => {
        try {
            const btn = req.body.deleteBtn
            const signeddata = await userdata.find({ useremail: email })
            // console.log(signeddata[0].data)
            const datas = signeddata[0].data
            // console.log(datas)
            // const requiredata = userdata.find({_id : "6030a49a9f28903b08180083"})
            // console.log(requiredata)
            console.log(userdata.find({useremail: email}))
            const deleteData = await userdata.updateOne(
                {useremail: email},
                {
                    $pull:{
                        data: {url : req.body.thisurl}
                    }
                },
                {safe: true}
            )
            console.log(btn)
            
            res.status(201).redirect('/')
        } catch (error) {
            console.log(error, "error in delete btn")
        }
    })

}
console.log()

// for home page
app.get('/', auth, async (req, res) => {

    const data = req.user.data
    const t = 0;
    const datas = []
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        const Spasswordvalue = cryptr.decrypt(element.Spassword)
        element["Spassword"] = Spasswordvalue
        datas.push(element)
        
    }
    res.render("home", { user: req.user, data: datas, length: datas.length})
    getdata(req.user.useremail)
    // console.log(typeof (datas))
    // console.log(add.find({}))
});



//for logout
app.get('/logout', auth, async (req, res) => {
    try {
        // for single device logout
        req.user.tokens = req.user.tokens.filter((current) => {
            req.user.tokens = []
            return current.tokenid != req.tokenid
        })
        res.clearCookie("jwt");

        await req.user.save()

        res.redirect("login", {msg: "Logout is Successful"});
    } catch (error) {
        res.status(500).redirect("/")
    }
})



// for login page
app.get('/login', (req, res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {
    try {
        const email = req.body.useremail;
        const password = req.body.password;

        const result = await userdata.findOne({ useremail: email });

        const Password = await bcrypt.compare(password, result.password);

        const token = await result.genrateToken();

        res.cookie("jwt", token, {
            httpOnly: true
        });

        if (Password && email != "" && password != "") {
            const results = await result.save();
            res.status(201).redirect("/",{msg: "Login is Successful"});
        } else {
            console.log("login not ok");
            res.status(400).redirect("login",{msg: "Try Again with correct entry"});
        }
    } catch (error) {
        console.log(error)
        res.status(400).redirect("login");
    }
})

// for registration page
app.get('/registration', (req, res) => {
    res.render('registration');
})

app.post('/registration', async (req, res) => {
    try {
        const email = req.body.useremail;
        const result = await userdata.findOne({ useremail: email })

        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if (password === cpassword && req.body.password != "") {
            const user = new userdata({
                username: req.body.username,
                useremail: req.body.useremail,
                password: req.body.password,
                cpassword: req.body.cpassword
            })
            // genrate token
            const token = await user.genrateToken();

            res.cookie("jwt", token, {
                httpOnly: true
            });

            const result = await user.save();
            // console.log(result)
            res.status(201).redirect("login")
        } else {
            console.log("invalid username and password");
            res.status(400).redirect("registration");
        }
    } catch (error) {
        console.log(error)
        res.status(400).redirect("registration")
    }
})

app.listen(port, () => {
    console.log(`connection is done on port no. ${port}`)
})