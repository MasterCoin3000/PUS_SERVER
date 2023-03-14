const mongoose = require("mongoose");

const hashRateSchema = new mongoose.Schema({
    U: String,
    hashrate: Number
});

hashRateSchema.pre("save", async function (next) {
    this.Date = new Date();
next();
})


const hashRate = mongoose.model('hashRate', hashRateSchema);



module.exports = hashRate;