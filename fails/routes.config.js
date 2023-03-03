var express = require('express')
var router = express.Router()

const fallController = require("./controllers/fail.controller");
//router.post("/", ipRangesController.creteIpRange);

//router.post("/", minerController.createMinerStatusRegister );

router.get("/", fallController.geTminersWithFail );


module.exports = router

