const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Database Connected")
}).catch((err)=>{
    console.log(err)
})

app.get("/test", (req,res)=>{
    return res.json("Hello Fuckyou")
})

app.listen(process.env.PORT, (port)=>{
    console.log("App listening at port: " + process.env.PORT )
})