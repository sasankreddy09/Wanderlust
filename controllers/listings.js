const listingSchema=require("../models/listing.js");
module.exports.index= async (req,res)=>{
    let arr=await listingSchema.find({});
    console.log(arr);
    res.render("index.ejs",{arr});
}
module.exports.newForm=(req,res)=>{// it should not be written after the listing/:id --> becuase first it takes new as 
    //also an id thats why the /listing/new is taken first and then /listing/:id;
    res.render("something.ejs");
}
module.exports.editForm= async(req,res)=>{
    let {id}=req.params;
    console.log("editing");
    console.log(req.params);
    let arr=await listingSchema.findById(id); 
    console.log(arr);
    let originalImage=arr.image.url;
    originalImage=originalImage.replace("/upload","/upload/w_250");//This is using cloudinary it can able to blur or reduce the quality of the image
    res.render("edit.ejs",{arr,originalImage});
}
module.exports.show=async (req,res)=>{
    let {id}=req.params;
    console.log("showing");
    console.log(req.params);
    let arr=await listingSchema.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
    if(!arr){
      req.flash("error","Listing requested is not found");
      res.redirect("/listing");
    }
    res.render("show.ejs",{arr});
  }
module.exports.delete=(req,res)=>{
    let {id}=req.params;
    console.log("delete");
    console.log(req.params);
    listingSchema.findByIdAndDelete(id).then(()=>{ req.flash("success","The listing is deleted successfully");res.redirect("/listing")});
  }
module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let {title,description}=req.body;
    let array=await listingSchema.findById(id);
    if(typeof req.file!="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      array.image={url,filename};
      await array.save().then((res)=>{console.log(res)})
    }
    listingSchema.findOneAndUpdate({title:title},{description:description}).then(()=>{  req.flash("success","The listing is edited successfully"); 
        res.redirect(`/listing/${id}`);})
  }
module.exports.new=async (req,res,next)=>{
    try{
      if(!req.body){
        throw new Exception(400,"bad request")
      }
      let url=req.file.path;
      let filename=req.file.filename;
      let arr=req.body;
      arr.owner=req.user._id;
      arr.image={url,filename};
      console.log(arr);
      let arr1=new listingSchema(arr);
      await arr1.save();
      req.flash("success","The new Listing is created successfully");
      res.redirect("/listing");
      console.log(req);
    }
      catch(err){
        res.send(err.message);
      }
  }