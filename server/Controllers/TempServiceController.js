const tempService = require('../Models/TempServiceModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
require("dotenv").config();

// Get All Temp Services
module.exports.getTempServices = async (req,res) =>{
    const services = await tempService.find()
    return res.json(services);
}