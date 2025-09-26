const express = require('express')
const adminModel = require('../model/adminModel')
const adminController = require('../controller/adminController')
const auth = require("../config/adminAuth")

const router = express.Router()

    
router.post('/addadmin', adminModel.adminImage , adminController.adminResgitration);
router.post('/adminlogin', adminController.loginAdmin)
router.get('/adminprofile', auth , adminController.viweAdminProfile);
router.post('/adminprofiledit/:_id' , adminModel.adminImage ,adminController.adminProfileEdit)
router.get('/admindelete/:_id' ,adminController.adminDelete)

router.post('/changepassword' , auth , adminController.changePassword)

module.exports = router;


