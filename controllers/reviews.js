const {listingSchemas,reviewSchema}=require("../schema.js");
const listingSchema=require("../models/listing.js");
const review=require("../models/review.js");
module.exports.creation=async (req,res)=>{
    let {id} =req.params;
    console.log(id);
    let body=req.body.review;
    body.author=res.locals.currUser;
    let reviews=new review(body);
    let listing=await listingSchema.findById(id);
    listing.review.push(reviews);
    let x=await reviews.save();
    let y=await listing.save();
    console.log(x);
    console.log(y);
    req.flash("success","The review is created successfully");
    res.redirect(`/listing/${id}`);
  }
module.exports.delete=async(req,res)=>{
    let {id,rid}=req.params;
    let rev=await review.findByIdAndDelete(rid);
    await listingSchema.findByIdAndUpdate(id,{$pull:{reviews:rid}})
    req.flash("success","The review is deleted successfully");
    res.redirect(`/listing/${id}`);
}