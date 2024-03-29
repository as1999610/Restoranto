var express = require("express");
var router = express.Router()
var passport = require("passport")
var User = require("../models/user")

router.get("/", function(req, es){
    res.render("landing");
});

// AUTH Routes
//show register form
router.get("/register", function(req, res){
    res.render("register");
});
//handle sign up logic
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message)
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Restoranto " + user.username)
            res.redirect("/restaurants");
        })
    })
});

// show login form
router.get("/login", function(req, res){
    res.render("login");
})

// login logic
router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/restaurants",
    failureRedirect: "/login"
}), function(req, res){
})

// logout logic
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have been Logged Out!")
    res.redirect("/restaurants")
});

module.exports = router;