var middlewareObject = {};
var Restaurant = require("../models/restaurant")
var Comment = require("../models/comment")

middlewareObject.checkRestaurantAuthenticated = function(req, res, next) {
        if(req.isAuthenticated()) {
            Restaurant.findById(req.params.id, function(err, restaurant){
                if(err){
                    req.flash("error", "Restaurant is invalid")
                    res.redirect("back")
                }
                else {
                    if(restaurant.author.id.equals(req.user._id)){
                        next();
                    }
                    else {
                        req.flash("error", "You do not have permission to do that.")
                        res.redirect("back");
                    }
            }
            });
        }
        else {
            req.flash("error", "You must login first!")
            res.redirect("back")
        }
}

middlewareObject.checkCommentAuthenticated = function(req, res, next){
        if(req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, function(err, comment){
                if(err){
                    res.redirect("back")
                }
                else {
                    if(comment.author.id.equals(req.user._id)){
                        next();
                    }
                    else {
                        req.flash("error", "You don't have permission to do that.")
                        res.redirect("back");
                    }
            }
            });
        }
        else {
            req.flash("error", "You must login first.")
            res.redirect("back")
        }
}

middlewareObject.isLoggedIn = function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must Login before you can do that!")
        res.redirect("/login");
}

module.exports = middlewareObject