var express = require('express')
var router = express.Router()

const minerController = require("./controllers/miner.controller");
//router.post("/", ipRangesController.creteIpRange);

router.post("/", minerController.createMinerStatusRegister );

router.get("/location/:fase", minerController.getMinersByFase );

router.get('/averageResponseTime/:fase', minerController.getAvgresponseTime )

router.get('/AvgfanFailResponseTime/:fase', minerController.getAvgfanFailResponseTime )


module.exports = router

