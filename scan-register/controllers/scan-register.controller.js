
const ScanRegister = require('../model/scan-register.model');

exports.createScanRegister = async (req,res) => {

    console.log('please dude');

    const scanId = req.body.scanId

    const latestScanRegister = await ScanRegister.create({scanId: scanId});

    console.log(latestScanRegister);

    res.status(201).json({
        status: "success",
        latestScanRegister
    })

}


exports.getLatestScanRegister = async (req,res) => {

    const latestScanRegister = await ScanRegister.find().sort({_id:-1}).limit(1);

    res.status(200).json({
        status: "success",
        latestScanRegister
    })

}


