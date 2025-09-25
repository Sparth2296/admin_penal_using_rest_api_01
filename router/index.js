const express = require('express')


const router = express.Router()

router.use('/admin', require("./adminRouter"));


module.exports = router;