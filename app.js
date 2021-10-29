//jshint esversion:6

require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;


// reading data from .env file
// console.log(process.env.API_KEY);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set("view engine", "ejs")

const dbConnectionString = "mongodb://localhost:27017/usersDB";
mongoose.connect(dbConnectionString, { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// adding encryption in  database
// const secret =process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });


const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hashedPassword) {
        const newUser = new User({
            email: req.body.username,
            password: hashedPassword
        });
        newUser.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully registered!!");
                res.render("secrets");
            }
        });
    });

});


app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (!foundUser) {
                console.log("Email not found!!");
            } else {
                // Load hash from your password DB.
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    if (result === true) {
                        console.log("Login Successfull!!");
                        res.render("secrets");
                    } else {
                        console.log("Invalid password!!");
                    }
                });
                
            }
        }
    })

});


app.listen(3000, function () {
    console.log("Server Started!!\nListening to port: http://localhost:3000/")
});