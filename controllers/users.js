const user = require("../models/user");
module.exports.signupPage=(req,res)=>{
    res.render("signup.ejs");
};
module.exports.signup=async (req,res,next)=>{
    try{
    let {username,email,password}=req.body;
    let data=new user({email,username});
    let x=await user.register(data,password);
    
    req.login(x,(err)=>{
        if(err){
            return next(err);
        }
        else{
        console.log(x);
        req.flash("success","The login is successful");
        res.redirect("/listing");
    }})
}
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};
module.exports.loginPage=(req,res)=>{
    res.render("login.ejs");
};
module.exports.login=async (req,res)=>{
    req.flash("success","Welcome back to the Wanderlust!!!");
    let path=res.locals.url||"/listing"
    res.redirect(path);
}
module.exports.logout=(req,res)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","logged you out");
      res.redirect("/listing");
    })
}