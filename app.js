//jshint esversion:6
 
const express = require("express");
const bodyParser = require("body-parser");
 
const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.set("view engine", "ejs")
 


app.get("/", function(req,res){
    res.render("home");
});
app.get("/login", function(req,res){
    res.render("login");
});
app.get("/register", function(req,res){
    res.render("register");
});
app.get("/secrets", function(req,res){
    res.render("secrets");
});


 
app.listen(3000, function () {
    console.log("Server Started!!\nListening to port: http://localhost:3000/")
});