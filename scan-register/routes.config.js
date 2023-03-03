var express = require('express')
var router = express.Router()

const scanRegisterControllers = require('./controllers/scan-register.controller')
//router.post("/", ipRangesController.creteIpRange);

router.get("/latest", scanRegisterControllers.getLatestScanRegister);

router.post("/", scanRegisterControllers.createScanRegister);

module.exports = router