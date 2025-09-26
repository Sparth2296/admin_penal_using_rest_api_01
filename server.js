const express = require('express')
const app = express()
const port = 3000
const db = require('./config/db')


app.use(express.urlencoded({extended : true}))
app.use('/' , require("./router/index"))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))