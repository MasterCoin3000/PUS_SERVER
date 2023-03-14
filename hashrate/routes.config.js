var express = require('express')
var router = express.Router()

const hashrateControllers = require("./controllers/hashrate.controller");

router.get("/", hashrateControllers.getHasrateRegisters);

router.post("/", hashrateControllers.saveHashrateRegister);


module.exports = router