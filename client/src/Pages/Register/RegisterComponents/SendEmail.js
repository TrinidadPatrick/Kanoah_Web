const nodemailer = require('nodemailer')

module.exports = async (email,subject, text) =>{
    try {   
        const transporter = nodemailer.createTransport({
            host : "",
            service : "",
            port : "",
            secure : Boolean(true),
            auth : {
                user : "",
                pass : ""
            }
        })

        await transporter.sendMail({
            from : "",
            to : "",
            subject : "",
            text : ""
        })

        console.log("Email Sent")
    } catch (error) {
        console.log("email not sent" + error)
    }
}