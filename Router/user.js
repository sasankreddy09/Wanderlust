const user = require("../models/user");
const router=require("express").Router();
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware");
const controlUser=require("../controllers/users");
router
    .route("/signup")
    .get(controlUser.signupPage)
    .post(controlUser.signup);
router
    .route("/login")
    .get(controlUser.loginPage)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),controlUser.login);
router
    .route("/logout")
    .get(controlUser.logout);
module.exports=router;