const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const passport=require("passport");
const LocalPassport=require("passport-local");
const app= express();
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const Exception=require("./utils/ExpressError.js");
const flash=require("connect-flash");
const expressSession=require("express-session");
const user=require("./models/user.js");
const listingRouter=require("./Router/listingRouter.js");
const reviewRouter=require("./Router/reviewRouter.js");
const userRouter=require("./Router/user.js");
const MongoStore = require('connect-mongo');
const port=3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const Atlas_url=process.env.ATLAS_MONGODB;
// connecting to mongoose
main()
.then(() => {
  console.log("connected to DB");
})
.catch((err) => {
  console.log(err);
});
async function main() {
  await mongoose.connect(MONGO_URL);
}
const store= MongoStore.create({
  mongoUrl: MONGO_URL,
  touchAfter:24*3600,
  crypto: {
    secret: 'sasank'
  } 
});
//using expression session
app.use(expressSession({
  store,//it takes it as a store:store
  secret:"sasank",
  saveUninitialized:true,
  resave:false,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
}
}))
app.set("view engine","ejs");
app.engine("ejs",ejsMate);
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.use(flash());
//intialize the passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalPassport(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})
app.listen(8080,()=>{
    console.log("The port is listening");
})
// app.get("/",(req,res)=>{
//     res.send("Hey!! myan I am the root.")
// })
app.use("/listing",listingRouter);
app.use(reviewRouter);
app.use(userRouter);
app.all("*",(req,res,next)=>{
  next(new Exception(404,"page not found"));
})
//configuring the errors
app.use((err,req,res,next)=>{
  let { status=500, message="something went wrong" }=err;
  res.render("error.ejs",{message,err});
  // res.status(status).send(message);
})