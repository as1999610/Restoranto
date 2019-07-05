var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash")
var passport = require("passport")
var LocalStrategy = require("passport-local")
var methodOverride = require("method-override")
var Restaurant = require("./models/restaurant")
var Comment = require("./models/comment")
var User = require("./models/user")
var seedDB = require("./seeds")

var commentRoutes = require("./routes/comments")
var restaurantRoutes = require("./routes/restaurants")
var indexRoutes = require("./routes/index")


mongoose.connect("mongodb://localhost/restoranto");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "I am not a human.",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/", indexRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/restaurants/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The RestaurantApp Has Started!")
});
