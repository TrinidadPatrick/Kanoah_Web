const mongoose = require('mongoose')

const tempServiceSchema = new mongoose.Schema({
        userId : {
            type : String
        }, 
        Title : {
            type : String,
            
        },
        OwnerEmail : {
            type : String,
            
        },
        OwnerContact : {
            type : String,
            
        },
        Description : {
            type : String,
            
        },
        ServiceContact : {
            type : String,
            
        },
        ServiceFaxNumber : {
            type : String,
            
        },
        ServiceEmail : {
            type : String,
            
        },
        ServiceCategory : {
            type : String,
            
        },
        ServiceOptions : {
            type : Object,
            
        },
        AcceptBooking : {
            type : Boolean,
            
        },
        SocialLink : {
            type : Object
        },
        PaymentMethod : {
            type : Object,
            
        },
        ServiceAddress : {
            type : Object,
            
        },
        serviceHours : {
            type : Object,
            
        },
        Tags : {
            type : Object
        }
})

module.exports = mongoose.model("temp_services", tempServiceSchema)