const Service = require('../Models/TempServiceModel')
const user = require('../Models/UserModel')
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

    const result = await user.findOne({_id : userId})

    const fullname = result.firstname + " " + result.lastname
  
    console.log(result)
    try {

        const result = await Service.create({userId, owner: fullname, basicInformation, advanceInformation, address, serviceHour, tags})
        return res.json({result})
    } catch (error) {
        return res.json({status : 0, message : error})
    }
}