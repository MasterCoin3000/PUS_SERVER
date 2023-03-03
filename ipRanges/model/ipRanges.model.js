const mongoose = require("mongoose");

const IpRangeSchema = new mongoose.Schema({
    rack: String,
    fase: String,
    u: String,
    bloque: String,
    nivel: String,
    lastScan: Date,   
    ipRange: {
        type: Array
    },
    status: {
        type: String,
        enum: ['occupied','available'],
        default: 'available'
    },
    scanedBy: String
});

IpRangeSchema.pre("save", async function (next) {
    this.lastScan = new Date();
    
next();
})

const IpRange = mongoose.model('IpRange', IpRangeSchema);



module.exports = IpRange;