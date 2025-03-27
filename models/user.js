const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// Add username and enable passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema); // Exporting as "User" model
