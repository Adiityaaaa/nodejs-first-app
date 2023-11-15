//const http = require("http");//importing modules by common js module technique for running this change type from module to common js in package json file
// import http from "http";//for running this we need to change type : from cmomon js to module in package json file and then we can import this using ejs modules
// console.log(http);

//const gfName = require("./features");//importing modules by common js 
// import gfName, { gfName2, gfName3, gfName4 }  from "./features.js"; //importing modules  by ejs modules
// import {} from "./features.js";
// console.log(gfName);
// console.log(gfName2);
// console.log(gfName3);
// console.log(gfName4);

// import * as myOBJ from "./features.js";
// console.log(myOBJ);
// console.log(myOBJ.gfName2);
// console.log(myOBJ.generateLovePercent());
// import fs from "fs";
// const home = fs.readFileSync("./index.html");
// console.log(home);

// Path Module
// import path from "path";
// console.log(path.extname("/json/profile/indexedDB.html"));
// console.log(path.dirname("/json/profile/indexedDB.html"));

// const server = http.createServer((req,res)=>{
//     console.log(req.method);
    /* Methods are of 4 types :
       1.GET :when we want to read basically
       2.POST :when we want to create data
       3.PUT : when we want to update data
       4.DELETE : when we want to delete data
       */


    // console.log("Served");
    // console.log(req.url);
//     if (req.url==="/about") {
//         res.end(`<h1 style="color:blue;text-align:center">Love is  ${myOBJ.generateLovePercent()} </h1>`);
//     }else if (req.url === "/") {
//         // fs.readFile("./index.html", (err, home)=>{// this is used when we use readfile fs module 
//             res.end(home);
//         // });
//     }else if (req.url === "/contact"){
//         res.end("<h1>Contact Page</h1>");
//     }else{
//         res.end("<h1>Page Not Found</h1>");
//     }
    
// });
// server.listen(5000,()=>{
//     console.log("Server Is Working");
// });






import express  from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import  jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";




mongoose.connect("mongodb://127.0.0.1:27017/mongose?", {
    dbName: "Backend",
})
.then(() => console.log("DataBase Connected"))
.catch((e)=> console.log(e));


const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
});


const User = mongoose.model("User",userSchema);

const app = express();

// Using Middleware
// console.log(path.join(path.resolve(),"public"));
app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded( { extended : true}))
app.use(cookieParser());



// Setting up view engine
app.set("view engine", "ejs");



const isAuthenticated = async(req, res, next) =>{
    const {token} = req.cookies;
    if(token){
        const decoded = jwt.verify(token, "sdffhjmnnfdsgdg");
        req.user = await User.findById(decoded._id);
        next();
    }
    else{
        res.redirect("/login");
    }
};

app.get("/", isAuthenticated, (req,res) => {
    // res.send("Hiee");
    // res.sendStatus(404);
    // res.status(404).send("Meri marzi");

    // const pathlocation = path.resolve();
    // console.log(pathlocation);
    // console.log(path.join(pathlocation, "./index.html"));
    // res.sendFile(path.join(pathlocation, "./index.html"));

    // res.render("index", {name : "Aditya Pratap Singh"});//this name is used to give any name dynamically to the ejs file


    // res.json({
    //     success : true,
    //     products : [],
    // });



    // console.log(req.cookies.token);
    // const token = req.cookies.token // or other way..


    // console.log(req.user);

    res.render("logout",{ name:req.user.name });
});

app.get("/login", (req, res) => {
    res.render("login");
});


app.get("/register", (req,res) => {
    res.render("register");
});

app.post("/login", async(req, res) => {
    const {email, password} = req.body;

    let user = await User.findOne({email});
    if(!user){
        return res.redirect("/register");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) return res.render("login", { email, message : "Incorrect Password"});
    

    const token = jwt.sign({_id:user._id},"sdffhjmnnfdsgdg");
    res.cookie("token", token, {
        httpOnly: true,
        expires:new Date(Date.now()+60*1000),
    });
    res.redirect("/");
});

app.post("/register", async(req, res) => {
    const {name, email, password} = req.body;

    let user = await User.findOne({email})
    if(user){
        return res.redirect("/login");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
    });



    const token = jwt.sign({_id:user._id},"sdffhjmnnfdsgdg");
    res.cookie("token", token, {
        httpOnly: true,
        expires:new Date(Date.now()+60*1000),
    });
    res.redirect("/");
});

app.get("/logout", (req, res) => {
    res.cookie("token", "null", {
        httpOnly: true,
        expires:new Date(Date.now()),
    });
    res.redirect("/");
});

// app.get("/add", async(req, res) => {
//     // Messge.create({name : "Adi", email : "abc@gmail.com"}).then(()=>{
//     //     res.send("Nice");
//     // });
//     // we can either use then or we can use async function and await keyword 
//     await Messge.create({name : "Adi2", email : "abc2@gmail.com"})
//         res.send("Nice");
    
    
// });

// app.get("/success", (req, res) => {
//     res.render("success");
// });

// app.post("/contact", async(req, res) => {
//     // console.log(req.body);
//     // console.log(req.body.name);
//     const {name, email} = req.body;
//     await Messge.create({name : name, email : email});
    
//     res.redirect("\success");
// });

// app.get("/users", (req, res) => {
//     res.json({
//         users,
//     });
// });


app.listen(5000, () => {
    console.log("Srever is Working");
})