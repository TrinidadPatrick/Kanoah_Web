const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        
    },
    firstname : {
        type : String,
        required : true,
        
    },
    lastname : {
        type : String,
        required : true,
        
    },
    contact : {
        type : String,
        required : true,
        unique : true
    },
    birthDate : {
        type : Object,
        required : true,
        
    }
})

module.exports = mongoose.model("User_Info", userSchema)