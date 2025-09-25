const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/adminpenal")


const db = mongoose.connection

db.once('open', (err)=>{
    (err) ? console.log(err) : console.log("mongoDB connected")
    
})

module.exports = db