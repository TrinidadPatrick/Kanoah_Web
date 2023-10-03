const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const userRoute = require('./Routes/userRoute')

app.use(express.json())
app.use(cors())
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Database Connected")
}).catch((err)=>{
    console.log(err)
})

app.use("/api", userRoute)



app.listen(process.env.PORT, ()=>{
    console.log("App listening at port: " + process.env.PORT )
})