const mongoose = require("mongoose");

const MinerSchema = new mongoose.Schema({
    U: String,
    model: String,
    lastScan: Date,
    scanDate: Date,
    ipRange: Array,
    workingMode: String,
    fan: Array,
    freq: Array,
    chainRate: Array,
    chainASC: Array,
    temp: Array,
    user: String,
    hashRateAVG: Number,
    hashRateNOM: Number,
    
    hashboardFail: Number,
    hashboardFailResponseTime: {type: Number, default: 0},
    formatHashboardFailResponseTime: {type: String, default: "n"},
    
    formatFanFaillResponseTime: {type: String, default: 'n'},
    fanFail:{type: Number, default: 0},
    fanFailResponseTime: {type: Number, default: 0},

    ip: {type:String, unique: true},
    
    hashRate: Number,
    performance: Number, 
    Elapsed: Number,
    reboot_1h: Boolean, 
    reboot_24h: Boolean,
    tempM95: Boolean,
    aliasModel: String,
    scanId: String
});

MinerSchema.pre("save", async function (next) {
    this.lastScan = new Date();

    
    
next();
})


const Miner = mongoose.model('Miner', MinerSchema);



module.exports = Miner;