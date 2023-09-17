
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    phoneNumber : {
        type : Number,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        required : true
    }, 
    aadhaarNo : {
        type : Number,
        required : true
    },
    doseCompleted : {
        type : Number,
        default : 0
    }
});

module.exports = mongoose.model("User", userSchema);