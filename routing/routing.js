const router=require("express").Router();
const wrapAsync=require("../utils/wrapAsync.js");
// const {listingSchemas}=require(".app.js");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const Exception=require("./utils/ExpressError.js");
const validationSchema=(req,res,next)=>{
    let {err}=listingSchemas.validate(req.body);
    console.log(err);
      if(err){
        let err=err.details.map((el)=>el.message).join(",");
        console.log(err);
        throw new ExpressError(400,err);
      }
      else{
        next();
      }
  }
router.get("/",wrapAsync((req,res)=>{
    res.send("Hey!! myan I am the root.")
}))
router.get("/listing",wrapAsync(async (req,res)=>{
    let arr=await listingSchema.find({});
    console.log(arr);
    res.render("index.ejs",{arr});
}))
router.get("/listing/new",wrapAsync((req,res)=>{// it should not be written after the listing/:id --> becuase first it takes new as 
  //also an id thats why the /listing/new is taken first and then /listing/:id;
  console.log("this is new section")
  res.render("something.ejs");
}))
router.get("/listing/:id/edit",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    console.log("editing");
    console.log(req.params);
    let arr=await listingSchema.findById(id); 
    console.log(arr);
    res.render("edit.ejs",{arr});
}))
router.get("/listing/:id",wrapAsync(async (req,res)=>{
  let {id}=req.params;
  console.log("showing");
  console.log(req.params);
  let arr=await listingSchema.findById(id);
  res.render("show.ejs",{arr});
}))
router.delete("/listing/:id",wrapAsync((req,res)=>{
  let {id}=req.params;
  console.log("delete");
  console.log(req.params);
  listingSchema.findByIdAndDelete(id).then(()=>{res.redirect("/listing")});
}))
router.patch("/listing",wrapAsync((req,res)=>{
  
  console.log(req.body);
  let title1=req.body.title;
  let description1=req.body.description;
  listingSchema.findOneAndUpdate({title:title1},{description:description1}).then(()=>{  res.redirect("/listing");})
}))
router.post("/listing",validationSchema,async (req,res,next)=>{
  try{
    if(!req.body){
      throw new Exception(400,"bad request")
    }
    let arr=req.body;
    let arr1=new listingSchema(arr);
    await arr1.save();
    res.redirect("/listing");}
    catch(err){
      res.send(err.message);
    }
})
router.all("*",(req,res,next)=>{
  next(new Exception(404,"page not found"));
})
router.use((err,req,res,next)=>{
  let { status=500, message="something went wrong" }=err;
  res.render("error.ejs",{err});
  // res.status(status).send(message);
})
module.exports=router;