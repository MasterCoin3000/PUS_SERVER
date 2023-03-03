const mongoose = require("mongoose");

const FailSchema = new mongoose.Schema({
    
    location: String,
    startDate: Date,
    endDate: Date,
    responseTimeMs: String,
    formateResponseTime: String,
    type: String,
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
    ip: {type:String},
    status: {
        type: String,
        enum: ['pending', 'resolved']
    }

});


const Fsil = mongoose.model('Fail', FailSchema);



module.exports = Fsil;