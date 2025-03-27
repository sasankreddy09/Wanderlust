const router=require("express").Router();
require('dotenv').config();
const {storage}=require("../cloudinary.js");
const wrapAsync=require("../utils/wrapAsync.js");
const multer  = require('multer')
const upload = multer({ storage })
const Exception=require("../utils/ExpressError.js");
const {listingSchemas,reviewSchema}=require("../schema.js");
const listingSchema=require("../models/listing.js");
const {isLoggedIn,isOwner,isUser}=require("../middleware.js");
const listingController = require("../controllers/listings.js");
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        listingController.new,
    );
    // .post(upload.single('listing[image]'),(req,res)=>{
    //     res.send(req.file);
    // });
router
    .route("/new")
    .get(isLoggedIn,listingController.newForm);
router
    .route("/:id/edit")
    .get(isLoggedIn,isOwner,wrapAsync(listingController.editForm));
router
    .route ("/:id")
    .get(wrapAsync(listingController.show))
    .patch(upload.single('image'),listingController.updateListing)
    .delete(isLoggedIn,isOwner,listingController.delete);
module.exports=router;