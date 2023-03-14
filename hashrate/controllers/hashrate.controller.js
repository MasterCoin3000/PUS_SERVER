const Hashrate = require('../model/hashrate.model');
const {getFilters} = require('../../utils/queryHelper')

exports.getHasrateRegisters = async (req,res) => {

    const queryFilter = getFilters(req.query)

    const hashrateRegs = await Hashrate.find(queryFilter.filter, {__v: 0,_id:0}).limit(queryFilter.opts.limit ? queryFilter.opts.limit : 0);

    res.status(200).json({
        status: "success",
        hashrateRegs
    })

}

exports.saveHashrateRegister = async (req, res) => {

    const hashrateRegs = Object.entries(req.body.hashrate)

    const newHashrateRegs = hashrateRegs.map(async (hashrateReg) => {
        return await Hashrate.create({hashrate: hashrateReg[1], U: hashrateReg[2]});
    } ) 

    Promise.all((newHashrateRegs) => {
        
        res.status(201).json({
            status: "success",
            newHashrateRegs
        })
        
    })
    
}

