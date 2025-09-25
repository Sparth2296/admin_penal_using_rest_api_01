const mongoose = require('mongoose')
const multer = require("multer")
const path = require('path')

const imagePath = "/upload/adminImage"

const adminSchema = mongoose.Schema({
    first_name : {
        type : String,
        required : true
    },
    last_name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    phone: {
         type : Number,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    create_data : {
        type : Date, 
        required : false
    },
    update_data : {
        type : Date, 
        required : false
    }

})

const adminStoreg = multer.diskStorage({
    destination : function(req , file , cb){
        cb(null , path.join(__dirname , '..' , imagePath))
    },
    filename : function(req , file , cb){
        cb(null , file.originalname)
    }
})

adminSchema.statics.adminImage = multer({storage : adminStoreg}).single("image");
adminSchema.statics.adminImagePath = imagePath;


const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
