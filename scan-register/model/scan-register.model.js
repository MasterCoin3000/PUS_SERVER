const mongoose = require("mongoose");

const scanRegisterSchema = new mongoose.Schema({
    Date: Date,
    scanId: String,
    minerCount: Number
});

scanRegisterSchema.pre("save", async function (next) {
    this.Date = new Date();
    next();
})


const scanRegister = mongoose.model('scanRegister', scanRegisterSchema);



module.exports = scanRegister;