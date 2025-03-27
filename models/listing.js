const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review=require("./review.js")
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:{
      type:String   
    },
    filename:{
      type: String},
  },
  price: Number,
  location: String,
  country: String,
  review:[{
    type:Schema.Types.ObjectId,
    ref:"Review"
  }],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
});
const Listing = mongoose.model("Listing", listingSchema);
listingSchema.post("findOneAndDelete",async (data)=>{
  if(data.review){
        await review.deleteMany({_id:{$in:Listing.review}});
}})
module.exports = Listing;