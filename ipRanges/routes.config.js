var express = require('express')
var router = express.Router()

const ipRangesController = require("./controllers/ipRanges.controller.js");

//router.post("/", ipRangesController.creteIpRange);

router.get("/", ipRangesController.getIpRanges);

//router.get("/test", ipRangesController.getIpRangeTest);

router.post("/", ipRangesController.createIpRange);

router.post("/auto", ipRangesController.createIpRanges);


module.exports = router