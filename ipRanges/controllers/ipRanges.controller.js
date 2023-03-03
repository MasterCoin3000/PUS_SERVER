const res = require("express/lib/response");
const IPRANGE = require("../model/ipRanges.model");


const getAvailableIpRanges = async (ipRanges, availableProcesses ) => {
    const isThereAvailableIpRanges = (ipRanges.length > 0) ? true : false;

    if(!isThereAvailableIpRanges) {

        await IPRANGE.updateMany({}, {status: "available"});

        const availableIpRanges = await IPRANGE.find({ status: "available" }).limit(availableProcesses);

        return availableIpRanges
    }

    else {
        return ipRanges
    }

}



exports.getIpRanges = async (req,res) => {

    const availableProcesses = req.query.availableProcesses;

    const ipRanges = await IPRANGE.find({ status: "available" }).limit(availableProcesses);

    const availableIpRanges = await getAvailableIpRanges(ipRanges, availableProcesses);

    availableIpRanges.forEach( async (ipRange) => {
        ipRange.status = "occupied";
        await ipRange.save()
    });

    res.send(availableIpRanges)

}


exports.createIpRange = async (req,res) => {

    console.log(req.body);

    const newipRange = await IPRANGE.create(req.body)

    res.status(200).json({
    status: "success",
    newipRange
})
}


exports.createIpRanges = async (req, res) => {

    const ipRangesContent = req.body.ipRanges;

    const ipRanges = ipRangesContent.map(async (ipRange) => {

        const newipRange = await IPRANGE.create(ipRange);

        console.log('new ip range -->  ',newipRange);

        return newipRange

    });

    res.status(200).json({
        status: "success",
        ipRanges
    })
}

