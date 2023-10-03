const user = require('../Models/UserModel')
const bcrypt = require('bcrypt')

module.exports.register = async (req,res) => {
    const {username, email, password, firstname, lastname, contact, birthDates} = req.body

    // res.json(birthDates)
    await user.create({username, email, password, firstname, lastname, contact, birthDate : birthDates}).then(()=>{
        res.json({message : "Registration completed Successfully" , status : "registered"})
    }).catch((err)=>{
        res.send(err)
    })
}