const express = require('express')
const adminModel = require('../model/adminModel')
const adminController = require('../controller/adminController')
const router = express.Router()

router.get('/adminData', adminController.adminData);
router.post('/add', adminModel.adminImage , adminController.addAdmin);
router.post('/add', adminModel.adminImage , adminController.addAdmin);



module.exports = router;


