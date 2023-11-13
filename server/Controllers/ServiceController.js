const Service = require('../Models/TempServiceModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
require("dotenv").config();

// Get All Temp Services
module.exports.getServices = async (req,res) =>{
    const services = await Service.find()
    return res.json(services);
}

// add Service
module.exports.addService = async (req,res) => {
    const basicInformation = req.body.serviceInformation.basicInformation
    const advanceInformation = req.body.serviceInformation.advanceInformation
    const address = req.body.serviceInformation.address
    const serviceHour = req.body.serviceInformation.serviceHour
    const tags  = req.body.serviceInformation.tags
    const userId = req.body.userId

    // console.log(req.body.serviceInformation)
    try {
        const result = await Service.create({userId, basicInformation, advanceInformation, address, serviceHour, tags})

        return res.json({result})
    } catch (error) {
        
    }
}