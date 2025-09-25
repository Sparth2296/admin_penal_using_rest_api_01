
const adminModel = require('../model/adminModel')
const admin = require('../model/adminModel')



module.exports.adminData = async (req , res)=>{
    try {

        res.status(200).json({msg : "this is the Admin Data"})
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : "Internal Server Error"})
        
    }
}

module.exports.addAdmin = async (req , res ) =>{
    try {
        
        console.log(req.body);
        console.log(req.file);


        const adminReg = {
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            email : req.body.email,
            username : req.body.username,
            password : req.body.password,
            phone : req.body.phone,
            image : `${admin.adminImagePath}/${req.file.originalname}`
        }

        
        res.status(200).json({msg : "new Admin register Succssefuly !! " ,data : adminReg })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : "Internal Server Error"})
        
    }
}