const listingSchema=require("./models/listing.js");
const reviewSchema=require("./models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
    req.session.url=req.originalUrl;
    console.log(req.originalUrl);
    req.flash("error","Please Login first");
    res.redirect("/login");
  }
  else{
    next()
  };
}
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.url){
      res.locals.url=req.session.url;
  }
  next();
}
module.exports.isOwner=async (req,res,next)=>{
  console.log("middleware");
  let {id}=req.params
  let array=await listingSchema.findById(id);
  if(!(array.owner._id.equals(res.locals.currUser._id))){
    req.flash("error","You are not the owner of this One");
    return res.redirect(`/listing/${id}`);
  }
  next();
}
module.exports.isAuthor=async (req,res,next)=>{
  let {id,rid}=req.params;
  let array=await reviewSchema.findById(rid);
  if(!(array.author._id.equals(res.locals.currUser._id))){
    req.flash("error","You are not the owner of this One");
    return res.redirect(`/listing/${id}`);
  }
  next();
}
module.exports.isUser=(req,res,next)=>{
  if(!req.isAuthenticated()){
  req.flash("error","Please Login first");
  res.redirect("/login");
}
else{
  next()
};
}