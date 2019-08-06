var express = require("express");
var router = express.Router()
var Restaurant = require("../models/restaurant")
var middleware = require("../middleware")

router.get("/", function(req, res){
    // Obtain all the restaurants for the Database
    Restaurant.find({}, function(err, restaurants){
        if(err){
            console.log(err);
        }
        else {
            res.render("restaurants/index", {restaurants:restaurants});           
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
   // get data from form and add it to the restaurant array
   var name = req.body.name
   var price = req.body.price;
   var image = req.body.image;
   var description = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newRestaurant = {name: name, price: price, description: description, author:author}
   // Create a new restaurant and save it to the database
   Restaurant.create(newRestaurant, function(err, newlyMade){
        if(err){
            console.log(err);
        }
        else {
             //redirect back to the restaurants page
             res.redirect("/restaurants");
        }
   });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("restaurants/new");
});

router.get("/:id", function(req, res){
    //find the restaurant with the input ID
    Restaurant.findById(req.params.id).populate("comments").exec(function(err, validRestaurant){
        if(err){
            console.log(err);
        }
        else {
            //render the show template
            res.render("restaurants/show", {restaurant: validRestaurant});
        }
    });
});

//Edit 
router.get("/:id/edit", middleware.checkRestaurantAuthenticated, function(req, res){
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
            res.redirect("/restaurants")
        }
                res.render("restaurants/edit", {restaurant: restaurant})
        });
});

//Update
router.put("/:id", middleware.checkRestaurantAuthenticated, function(req, res){
    //find and update 
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, editedRestaurant){
        if(err){
            res.redirect("/restaurants");
        }
        else {
            res.redirect("/restaurants/" + req.params.id)
        }
    })
});

//Destroy
router.delete("/:id", middleware.checkRestaurantAuthenticated, function(req, res){
    Restaurant.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/restaurants");
        }
        else {
            res.redirect("/restaurants")
        }
    })
});


module.exports = router;
