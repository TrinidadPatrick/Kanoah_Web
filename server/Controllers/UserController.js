const user = require('../Models/UserModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
require("dotenv").config();


// Registers the user
module.exports.register = async (req,res) => {
    const {username, email, password, firstname, lastname, contact, birthDate} = req.body

    // res.json(birthDates)
    const filterEmail = await user.findOne({email : email})
    const filterusername = await user.findOne({username : username})
    if(filterEmail){
        return res.json({message : "Email already Exist"})
    }if(filterusername) {
        return res.json({message : "Username already Exist"})
    }else if (!filterEmail && !filterusername){
        await user.create({username, email, password, firstname, lastname, contact, birthDate : birthDate}).then((response)=>{
            res.json({message : "Registration completed Successfully" , status : "registered"})
        }).catch((err)=>{
            res.send(err)
        })
    }

   
}

// CODE GENERATOR FOR OTP--------------------------------------------------------------------------

    let code = []
// ------------------------------------------------------------------------------------------------

    // FOR EMAIL VERIFICATION SEND OTP EMAIL
module.exports.verifyEmail = (req,res) => {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const arr = []
    for(var i=1; i<7;i++){
        arr.push(letters[Math.floor(Math.random() * 40)])
    }

    code = arr.join("")
    const emailTo = req.body.email
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
          user : process.env.USER,
          pass : process.env.PASS
        }
      })

      const email = {
        from: process.env.USER,
        to: emailTo,
        subject: 'Account Verification',
        text: 'Welcome',
        html : `
        <div>
        <p>Please enter this code to verify your account : ${code}</p>
        </div> `
    };

     transporter.sendMail(email, function(error, success){
      if (error) {
          console.log(error);
      } else {
          console.log('Nodemailer Email sent: ' + success.response);
      }
  });
}

// OTP VERIFICATION
module.exports.verifyOTP = async (req,res) => {
    const username = req.body.username
    const otp = req.body.otp
    if(otp == code){
        const userId = await user.find({username : username}).select("_id")
        
        await user.findByIdAndUpdate(userId, {verified : true}).then(()=>{
            return res.json({message : 'Verified'})
        }).catch    ((err)=>{
            return res.json({message : err})
        })   
    }else{
        res.send("Invalid")
    }
}