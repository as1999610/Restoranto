var express = require("express");
var router = express.Router({mergeParams: true});
var Comment = require("../models/comment")
var middleware = require("../middleware")

// The routes for the comments begin here.
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find the restaurant
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
        console.log(err)
        }
        else {
            res.render("comments/new", {restaurant:restaurant})
        }
    })
    res.render("comments/new");
})

router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup restaurant
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
            console.log(err);
            res.redirect("/restaurants")
        }
        else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "There was an error.")
                    console.log(err)
                }
                else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    restaurant.comments.push(comment)
                    restaurant.save()
                    req.flash("success", "Comment was successfully added")
                    res.redirect('/restaurants/' + restaurant._id);
                }
            })
        }
    })
    //create a comment
    //connect new comment to the restaurant
    //redirect campground show page
});

//Editing comments
router.get("/:comment_id/edit", middleware.checkCommentAuthenticated, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            res.redirect("back")
        }
        else {
            res.render("comments/edit", {restaurant_id: req.params.id, comment: comment});
        }
    })
});

//Updating comments
router.put("/:comment_id", middleware.checkCommentAuthenticated, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            res.redirect("back")
        }
        else {
            res.redirect("/restaurants/" + req.params.id);
        }
    })
});

// Deleting comments
router.delete("/:comment_id", middleware.checkCommentAuthenticated, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back")
        }
        else {
            req.flash("success", "The comment was successfully removed.")
            res.redirect("/restaurants/" + req.param.id);
        }
    });
});



module.exports = router;