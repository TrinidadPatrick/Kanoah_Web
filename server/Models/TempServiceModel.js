const mongoose = require('mongoose')

const ServiceSchema = new mongoose.Schema({
        userId : {
            type : String
        }, 
        basicInformation : {
            type : Object
        }, 
        advanceInformation : {
            type : Object
        },
        address : {
            type : Object
        },
        serviceHour : {
            type : Object
        },
        tags : {
            type : [String]
        },
        
})

module.exports = mongoose.model("services", ServiceSchema)