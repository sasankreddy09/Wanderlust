const rout=require("express").Router({mergeParams:true});//if we want merge in rout.js code that means rout.use("/review",review)--> it is restricted to rout.js if we want to add whole then mergeParams:true
const wrapAsync=require("../utils/wrapAsync.js");
const Exception=require("../utils/ExpressError.js");
const {listingSchemas,reviewSchema}=require("../schema.js");
const listingSchema=require("../models/listing.js");
const review=require("../models/review.js");
const {isLoggedIn,isAuthor,isUser}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");
const validationReview=(req,res,next)=>{
    let err =reviewSchema.validate(req.body);
    err=err.error;
    if(err){
      let ers=err.details.map((er)=>er.message).join(",");
      ers=ers.toString();
      throw new Exception (400,ers) ;
    }
    else{
      next();
    }
  }
rout
    .route("/listing/:id/review")
    .post(isLoggedIn,validationReview,wrapAsync(reviewController.creation));
rout
    .route("/listing/:id/review/:rid")
    .delete(isUser,isAuthor,reviewController.delete);
module.exports=rout;