//jshint esversion:6

require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


// reading data from .env file
// console.log(process.env.API_KEY);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set("view engine", "ejs")

app.use(session({
    secret:"this is sceret.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



const dbConnectionString = "mongodb://localhost:27017/usersDB";
mongoose.connect(dbConnectionString, { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
    res.render("home");
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.get("/register", function (req, res) {
    res.render("register");
});
app.get("/secrets", function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }else{
        res.redirect("/login");
    }
});
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})

//register new user
app.post("/register", function (req, res) {
    //  register function comes from passport-local-mongoose
    User.register({username:req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            // authenticate user using cookies
            passport.authenticate("local")(req,res, function(){
                res.redirect("/secrets");
            });
        }
    });
});

// login
app.post("/login", function (req, res) {
    
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    //login methods comes from passport
    req.login(user, function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("/secrets")
            });
        }
    });
});


app.listen(3000, function () {
    console.log("Server Started!!\nListening to port: http://localhost:3000/")
});