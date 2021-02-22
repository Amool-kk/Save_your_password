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
const add = require("./models/post")
const auth = require("./middleware/auth");
const { db } = require('./models/post');
const { constants } = require('buffer');



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
                if (req.body.url != "" && req.body.USERNAME != "" && req.body.Spassword != "") {
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

                } else {
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
    app.post('/Delete', async (req, res) => {
        try {
            const btn = req.body.deleteBtn
            const signeddata = await userdata.find({ useremail: email })
            // console.log(signeddata[0].data)
            const datas = signeddata[0].data
            // console.log(datas)
            // const requiredata = userdata.find({_id : "6030a49a9f28903b08180083"})
            // console.log(requiredata)
            console.log(userdata.find({ useremail: email }))
            const deleteData = await userdata.updateOne(
                { useremail: email },
                {
                    $pull: {
                        data: { url: req.body.thisurl }
                    }
                },
                { safe: true }
            )
            console.log(btn)

            res.status(201).redirect('/')
        } catch (error) {
            console.log(error, "error in delete btn")
        }
    })

}

// for read data from add collection
const readdata = async (email) => {
    const result = await add.find({ id: email })
    // console.log(typeof(result))
    return result
}

// for delete from add collection
const deletedata = async (id) => {
    const result = await add.deleteOne({ _id: id })
    return result
}

// for home page
app.get('/', auth, async (req, res) => {
    // const data = req.user.data
    req.query.searchTxt = ""
    const datalist = await readdata(req.user.useremail);
    const datas = []
    for (let i = 0; i < datalist.length; i++) {
        const element = datalist[i];
        const Spasswordvalue = cryptr.decrypt(element.Spassword)
        element["Spassword"] = Spasswordvalue
        datas.push(element)
    }

    res.render("home", { user: req.user, data: datas, length: datas.length })
    // getdata(req.user.useremail)
    // console.log(typeof (datas))
    // console.log(add.find({}))
});


// post request for delete 
app.post('/Delete', auth, async (req, res) => {
    try {
        
        const datalist = await deletedata(req.body.deleteBtn)
        res.redirect('/')
    } catch (error) {
        console.log(error+"error in delete post request")
    }
})


// for search 
app.get('/search',auth, async (req,res)=>{
    try{
        let searchTxt = req.query.searchTxt;
        console.log(searchTxt)
        if(searchTxt !=""){
            const result1 = await add.find({USERNAME: {$regex: searchTxt,$options: '$i'}})
            const result2 = await add.find({url: {$regex: searchTxt,$options: '$i'}})
        // console.log(result);
        const datas = []
        for (let i = 0; i < result1.length; i++) {
            const element = result1[i];
            const Spasswordvalue = cryptr.decrypt(element.Spassword)
            element["Spassword"] = Spasswordvalue
            datas.push(element)
        }
        for (let i = 0; i < result2.length; i++) {
            const element = result2[i];
            const Spasswordvalue = cryptr.decrypt(element.Spassword)
            element["Spassword"] = Spasswordvalue
            datas.push(element)
        }
        
        res.render("home", { user: req.user, data: datas, length: datas.length})
        }else{
            res.redirect('/')
        }
    }catch(error){
        console.log(error+"error in search");
    }
    
})

// save data in database
app.post("/data-post", auth, async (req, res) => {
    try {
        if (req.body.url != "" && req.body.USERNAME != "" && req.body.Spassword != "") {
            const data = new add({
                id: req.user.useremail,
                url: req.body.url,
                USERNAME: req.body.USERNAME,
                Spassword: req.body.Spassword
            });

            const result = await data.save()
            // console.log(result)
            res.redirect('/')
        } else {
            res.redirect('/')
        }

    } catch (error) {
        console.log(error)
        res.redirect('/')
    }

})



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

        res.redirect("login",);
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
            res.status(201).redirect("/",);
        } else {
            console.log("login not ok");
            res.status(400).redirect("login",);
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