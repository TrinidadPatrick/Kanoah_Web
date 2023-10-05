const user = require('../Models/UserModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
require("dotenv").config();
const jwt = require('jsonwebtoken')


// Registers the user
module.exports.register = async (req,res) => {
    const {username, email, password, firstname, lastname, contact, birthDate} = req.body

    // res.json(birthDates)
    const filterEmail = await user.findOne({email : email})
    const filterusername = await user.findOne({username : username})
    const image = `https://ui-avatars.com/api/?name=${firstname}+${lastname}`
    if(filterEmail){
        return res.json({message : "Email already Exist"})
    }if(filterusername) {
        return res.json({message : "Username already Exist"})
    }else if (!filterEmail && !filterusername){
        
        const hashedPassword = await bcrypt.hash(password, 10)
        await user.create({username, email, password : hashedPassword, firstname, lastname, contact, birthDate : birthDate, profileImage : image}).then((response)=>{
            const token = jwt.sign({
                username : username,
                email : email,
                _id : response._id
    
            }, process.env.SECRET_KEY)
            res.json({message : "Registration completed Successfully" , status : "registered", userToken : token})
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
        arr.push(letters[Math.floor(Math.random() * letters.length)])
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
    const id = req.body._id
    const otp = req.body.otp
    if(otp == code){
        const userId = await user.find({_id : id}).select("_id")
        
        await user.findByIdAndUpdate(userId, {verified : true}).then(()=>{
            return res.json({message : 'Verified'})
        }).catch    ((err)=>{
            return res.json({message : err})
        })   
    }else{
        res.send("Invalid")
    }
}

// Login in
module.exports.login = async (req,res) => {
    const UsernameOrEmail = req.body.UsernameOrEmail
    const password = req.body.password

    const result = await user.findOne({ $or : [{username : UsernameOrEmail}, {email : UsernameOrEmail} ] })
    if(result != null){
        const comparePassword = await bcrypt.compare(password, result.password)
        if(comparePassword){
            return res.json({status : 'authenticated'})
        }else {
            return res.json({status : 'invalid username or password'})
        }
        
    }else{
        return res.json({status : 'account not found'})
    }
    
}

// Forgot Password
let FPcode = ''
module.exports.forgotPassword = async (req,res) => {
      const result = await user.findOne({email : req.body.email})

      if(result != null){

        const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", 1, 2, 3, 4, 5, 6, 7, 8, 9]
        const arr = []
        for(var i=1; i<7;i++){
        arr.push(letters[Math.floor(Math.random() * letters.length)])
        }
        FPcode = arr.join("")

        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
              user : process.env.USER,
              pass : process.env.PASS
            }
          })
    
          const email = {
            from: process.env.USER,
            to: result.email,
            subject: 'Password Reset',
            text: 'Welcome',
            html : `
            <div>
            <p>Someone requested a password reset to this account, use this OTP to reset your account. If 
            you did not make this request please change your password now.</p>

            <h2>Code: </h2><br>
            <h1>${FPcode}</h1>
            </div> `
        };
    
         transporter.sendMail(email, function(error, success){
          if (error) {
              console.log(error);
          } else {
              console.log('Nodemailer Email sent: ' + success.response);
          }
      });
      res.json({message : "Found"})
      }else{
        res.json({message : "Account not found"})
      }
}

// Submitted OTP for verification
module.exports.submitOtpForNewPassword = async (req,res)=>{
    const email = req.body.email
    const otp = req.body.code
    if(otp == ""){
        res.json({status : "invalid"})
    }
    else if(FPcode == otp){
        res.json({status : "verified"})
        FPcode = ''
    }
    else{
        res.json({status : "invalid"})
    }
}

// New Password from forget password
module.exports.newPassword = async (req,res) => {
    const password = req.body.password
    const email = req.body.email
    const hashedPassword = await bcrypt.hash(password, 10)

    const updatePassword = await user.findOneAndUpdate({email : email}, {password : hashedPassword})
    if(updatePassword){
        res.json({status : "updated"})
    }else {
        res.json({status : "failed"})
    }
}