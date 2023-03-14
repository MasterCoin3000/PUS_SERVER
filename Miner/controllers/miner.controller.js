const res = require("express/lib/response");
const Miner = require("../model/miner.model"); 
const IpRange = require("../../ipRanges/model/ipRanges.model");
const ScanRegister = require('../../scan-register/model/scan-register.model');
const { format } = require("express/lib/response");
const failController = require('../../fails/controllers/fail.controller')
//]{




const addMinersToDB2 = async(miners) => {
    
        const minersInDb = await Miner.find({HashBoardFail: {$gte: 0} } );
       
        const updatedMiners = {}
        updatedMiners.multiErrorApparences = []
        updatedMiners.noErrorMiners = []
    
        minersInDb.forEach((miner, index) => {
            
            if (miners[miner.ip] && miners[miner.ip].HashBoardFail) {
                miner.HashBoardFailErrorAparences = miners[miner.ip].HashBoardFail ? (miner.HashBoardFailErrorAparences ? miner.HashBoardFailErrorAparences++ : 1 ) : 0
                //miner.fanFailErrorAparences = miners[miner.ip].fanFail ? miner.fanFailErrorAparences+1 : 0

                updatedMiners.multiErrorApparences.push(miner)
    
                delete miners[miner.ip]
            }
    
            else {
                miner.HashBoardFailErrorAparences = 0
                //miner.fanFailErrorAparences = 0
                updatedMiners.noErrorMiners.push(miner)
            }
    
        });
    
        return updatedMiners
}

const addMultiErrorApparencesMiners = async (multiErrorApparences) => {

    multiErrorApparences.forEach( async (miner) => {
        const updatedMiner = await Miner.updateOne({ip: miner.ip},miner);
        console.log(updatedMiner);
    });

}

const addNewMinersWithErrors = async (newMiners) => {
    
    let minersWithError = []

    for (const miner in newMiners)  {
        minersWithError.push(newMiners[miner])
        const newMiner = await Miner.create(newMiners[miner])
        console.log(newMiner);
    }

    return minersWithError
}

const resetMinerErrorsApparences = (noErrorMiners) => {
    
    let resetedMiners = []

    noErrorMiners.forEach(miner => {
        resetedMiners.push(miner)

        const deletedMiner = Miner.deleteOne({ip: miner.ip});

    });

     
}

const toObj= (arr) => {
    let obj = {}
    arr.forEach(element => {
        obj[element.ip] = {}
        obj[element.ip].ip = element.ip
        obj[element.ip].model = element.model
        obj[element.ip].HashBoardFail = element.HashBoardFail
        obj[element.ip].ipRange = element.ipRange
    });
    return obj
}

const saveMiner = (miners) => {
    
    miners.forEach(async (miner) => {

        const prevMiner = await Miner.find({ip: miner.ip})

        if(prevMiner.length) {

            miner.fanFailErrorAparences = 0
            
            if (prevMiner.fanFailErrorAparences && miner.fanFail){
                miner.fanFailErrorAparences = prevMiner.fanFailErrorAparences+1
            }

            else if (miner.fanFail) {
                miner.fanFailErrorAparences = 1
            }

            if(prevMiner.hashboardFailErrorAparences&& miner.hashboardFail){
                miner.hashboardFailErrorAparences = prevMiner.hashboardFailErrorAparences+1
            }

            else if(miner.HashBoardFail){
                miner.hashboardFailErrorAparences = 1
            }

            

            const updatedMiner = await Miner.findOneAndUpdate({ip: miner.ip}, miner)


        }

        else{
            const newMiner = await Miner.create(miner)

            console.log(newMiner)
        }
    });
}

const formatResponseTime = (minutes) => {
    
    if(minutes >= 60 && minutes < 1440) {
        return `${Math.trunc(minutes / 60)}h`
    }

    else if(minutes >= 1440 ){
        return `${Math.trunc(minutes / 1440)}d`
    }

    else {
        return `${minutes}m`
    }


}

const saveMiner2 = async (miners,scanId) => {

    try {

    const actualScan = await ScanRegister.findOne({scanId: scanId});

    actualScan.minerCount = miners.length;

    await actualScan.save()

    console.log(miners);

    console.log("here they are");

    
        const MinersFromDB = await Miner.find({U: miners[1].U});
    
   

    console.log(miners);

    let prevMiners = {}

    MinersFromDB.forEach(miner => {
        prevMiners[miner.ip] = miner
    });


    
    miners.forEach(async (miner) => {
    
    //const prevMiner = await Miner.findOne({ip: miner.ip})

    miner.scanId = scanId

    miner.lastScan = new Date()

    if(prevMiners[miner.ip]) {

        // the miner continues with hashboard fail
        if(prevMiners[miner.ip].hashboardFail && miner.hashboardFail) {
                console.log(miner.ip);
                console.log(prevMiners[miner.ip].hashboardFailResponseTime);
                console.log((new Date() - prevMiners[miner.ip].lastScan) / 1000 / 60);
                miner.hashboardFailResponseTime = (prevMiners[miner.ip].hashboardFailResponseTime + ((new Date() - prevMiners[miner.ip].lastScan) / 1000 / 60)).toFixed(2);
                //console.log(formatResponseTime(miner.hashboardFailResponseTime));
                miner.formatHashboardFailResponseTime = formatResponseTime(miner.hashboardFailResponseTime)

        }

        // the miner continues with fan fail
        if(prevMiners[miner.ip].fanFail && miner.fanFail) {
                //miner.fanFailResponseTime = (prevMiners[miner.ip].hashboardFailResponseTime +  (new Date() - prevMiners[miner.ip].lastScan / 1000);
                miner.fanFailResponseTime = Number(prevMiners[miner.ip].fanFailResponseTime + ((new Date() - prevMiners[miner.ip].lastScan) / 1000 / 60)).toFixed(2);
                miner.formatFanFaillResponseTime = formatResponseTime(miner.fanFailResponseTime)
                //console.log('fan  ',miner.U ,formatResponseTime(miner.fanFailResponseTime));
        }

        // hashboard error solved
        if(prevMiners[miner.ip].hashboardFail && !miner.hashboardFail){
                miner.hashboardFailResponseTime = 0
                miner.formatHashboardFailResponseTime = 'n'
        }

        // fan error solved
        if(prevMiners[miner.ip].fanFail && !miner.fanFail){
                miner.fanFailResponseTime = 0,
                miner.formatFanFaillResponseTime = 'n'

        }

        if(prevMiners[miner.ip].tempM95 && miner.tempM95){
                miner.tempM95ResponseTime = prevMiners[miner.ip].tempM95ResponseTime +  (new Date() - prevMiners[miner.ip].lastScan / 1000);
                miner.formatTempM95ResponseTime = formatResponseTime(miner.tempM95ResponseTime)
        }

        if(prevMiners[miner.ip].tempM95 && !miner.tempM95){
                miner.tempM95ResponseTime = 0,
                miner.formatTempM95ResponseTime = 'n'

        }

        const updatedMiner = await Miner.findOneAndUpdate({ip: miner.ip}, miner)

        console.log(updatedMiner);


        //const newMiner = await Miner.create(miner)


    }

    else{
        try {
            const newMiner = await Miner.create(miner)
        } catch (error) {
            console.log(error);
            console.log(miner.ip);
        }
    }

    if(miner.formatHashboardFailResponseTime !== '4d' && miner.formatHashboardFailResponseTime) {
        console.log('we got problems Yo');
    }

    delete prevMiners[miner.ip];

    })

    for (const miner in prevMiners) {
        const removedMiner = await Miner.deleteOne({ip: prevMiners[miner].ip});
        console.log('removed miner', removedMiner);
    }

} catch (error) {
    console.log(error);
}
    
    
};

const saveMiner3= async (Us,scanId, minerCoun) => {

    try {

    const actualScan = await ScanRegister.findOne({scanId: scanId});

    actualScan.minerCount = minerCoun;

    await actualScan.save()

    //console.log(miners);
    
    const MinersFromDB = await Miner.find();

    console.log('MinersFromDB', MinersFromDB.length)


    let prevMiners = {}

    MinersFromDB.forEach(miner => {
        prevMiners[miner.ip] = miner
    });

    console.log('prevminers', Object.keys(prevMiners).length)
    
    

    Us.forEach(miners => {
        miners.forEach(async (miner, index) => {
    
            //const prevMiner = await Miner.findOne({ip: miner.ip})
        
            miner.scanId = scanId
        
            miner.lastScan = new Date()
            miner.scanDate = new Date()
        
        
            if(prevMiners[miner.ip]) {
        
                // the miner continues with hashboard fail
                if(prevMiners[miner.ip].hashboardFail && miner.hashboardFail) {
                        // console.log(miner.ip);
                        // console.log(prevMiners[miner.ip].hashboardFailResponseTime);
                        // console.log((new Date() - prevMiners[miner.ip].lastScan) / 1000 / 60);
                        miner.hashboardFailResponseTime = (prevMiners[miner.ip].hashboardFailResponseTime + ((new Date() - prevMiners[miner.ip].lastScan) / 1000 / 60)).toFixed(2);
                        //console.log(formatResponseTime(miner.hashboardFailResponseTime));
                        miner.formatHashboardFailResponseTime = formatResponseTime(miner.hashboardFailResponseTime)
        
                }
        
                // the miner continues with fan fail
                if(prevMiners[miner.ip].fanFail && miner.fanFail) {
                        //miner.fanFailResponseTime = (prevMiners[miner.ip].hashboardFailResponseTime +  (new Date() - prevMiners[miner.ip].lastScan / 1000);
                        miner.fanFailResponseTime = Number(prevMiners[miner.ip].fanFailResponseTime + ((new Date() - prevMiners[miner.ip].lastScan) / 1000 / 60)).toFixed(2);
                        miner.formatFanFaillResponseTime = formatResponseTime(miner.fanFailResponseTime)
                        //console.log('fan  ',miner.U ,formatResponseTime(miner.fanFailResponseTime));
                }



        
                // hashboard error solved
                if(prevMiners[miner.ip].hashboardFail && !miner.hashboardFail){
                        miner.hashboardFailResponseTime = 0
                        miner.formatHashboardFailResponseTime = 'n'
                        console.log( await failController.changeFailStatus(miner.ip, miner.hashboardFail ))
                }
        
                // fan error solved
                if(prevMiners[miner.ip].fanFail && !miner.fanFail){
                        miner.fanFailResponseTime = 0,
                        miner.formatFanFaillResponseTime = 'n'
                        console.log( await failController.changeFailStatus(miner.ip, miner.fanFail ))
                }
        
                if(prevMiners[miner.ip].tempM95 && miner.tempM95){
                        miner.tempM95ResponseTime = prevMiners[miner.ip].tempM95ResponseTime +  (new Date() - prevMiners[miner.ip].lastScan / 1000);
                        miner.formatTempM95ResponseTime = formatResponseTime(miner.tempM95ResponseTime)
                }
        
                if(prevMiners[miner.ip].tempM95 && !miner.tempM95){
                        miner.tempM95ResponseTime = 0,
                        miner.formatTempM95ResponseTime = 'n'
        
                }

                //new errors

                
                // new hashboardFail 
                if(!prevMiners[miner.ip].hashboardFail && miner.hashboardFail) {

                    console.log(await failController.createFail(miner.U, miner.hashboardFail, miner.ip, 'hashboardFail'))
                
                }

                // new fanFail 
                if(!prevMiners[miner.ip].fanFail && miner.fanFail) {

                    console.log(await failController.createFail(miner.U, miner.fanFail, miner.ip, 'fanFail'))
                
                }
        
                const updatedMiner = await Miner.findOneAndUpdate({ip: miner.ip}, miner)
        
        
        
                //const newMiner = await Miner.create(miner)
        
        
            }
        
            else{
                try {

                    // new errors in new miners 

                    if (miner.fanFail) {
                        
                        await failController.createFail(miner.U, miner.fanFail, miner.ip, 'fanFail')
                        //console.log(await failController.createFail(miner.U, miner.fanFail, miner.ip, 'fanFail'))

                    }

                    if(miner.hashboardFail) {

                        await failController.createFail(miner.U, miner.hashboardFail, miner.ip, 'hashboardFail')
                    
                    }

                    const newMiner = await Miner.create(miner)
                } catch (error) {
                    console.log(error);
                    console.log(miner.ip);
                }
            }
        

        
            delete prevMiners[miner.ip];
            console.log(index,' ', miner.ip);
            console.log('prevminers', Object.keys(prevMiners).length)
            if ((index+1) === miners.length) {
                console.log('done');
            }
            })
    });
    

    //console.log('here', Object.keys(prevMiners).length);
    for (const miner in prevMiners) {
        const removedMiner = await Miner.deleteOne({ip: prevMiners[miner].ip});
        console.log('removed miner', miner);
    }

} catch (error) {
    console.log(error);
}
    
    
};

const saveMiner4 = async (Us,scanId, minerCoun) => {

    try {

    const actualScan = await ScanRegister.findOne({scanId: scanId});

    actualScan.minerCount = minerCoun;

    await actualScan.save()

    //console.log(miners);
    
    const MinersFromDB = await Miner.find();

    console.log('MinersFromDB', MinersFromDB.length)


    let prevMiners = {}

    MinersFromDB.forEach(miner => {
        prevMiners[miner.ip] = miner
    });

    console.log('prevminers', Object.keys(prevMiners).length)
    
    const newMiners = []

       const res = Us.map(async (miner, index) => {
    
            //const prevMiner = await Miner.findOne({ip: miner.ip})
        
            miner.scanId = scanId
        
            miner.lastScan = new Date()
            miner.scanDate = new Date()
        
        
            if(prevMiners[miner.ip]) {
        
                // the miner continues with hashboard fail
                if(prevMiners[miner.ip].hashboardFail && miner.hashboardFail) {
                        // console.log(miner.ip);
                        // console.log(prevMiners[miner.ip].hashboardFailResponseTime);
                        // console.log((new Date() - prevMiners[miner.ip].lastScan) / 1000 / 60);
                        miner.hashboardFailResponseTime = (prevMiners[miner.ip].hashboardFailResponseTime + ((new Date() - prevMiners[miner.ip].lastScan) / 1000 / 60)).toFixed(2);
                        //console.log(formatResponseTime(miner.hashboardFailResponseTime));
                        miner.formatHashboardFailResponseTime = formatResponseTime(miner.hashboardFailResponseTime)
        
                }
        
                // the miner continues with fan fail
                if(prevMiners[miner.ip].fanFail && miner.fanFail) {
                        //miner.fanFailResponseTime = (prevMiners[miner.ip].hashboardFailResponseTime +  (new Date() - prevMiners[miner.ip].lastScan / 1000);
                        miner.fanFailResponseTime = Number(prevMiners[miner.ip].fanFailResponseTime + ((new Date() - prevMiners[miner.ip].lastScan) / 1000 / 60)).toFixed(2);
                        miner.formatFanFaillResponseTime = formatResponseTime(miner.fanFailResponseTime)
                        //console.log('fan  ',miner.U ,formatResponseTime(miner.fanFailResponseTime));
                }



        
                // hashboard error solved
                if(prevMiners[miner.ip].hashboardFail && !miner.hashboardFail){
                        miner.hashboardFailResponseTime = 0
                        miner.formatHashboardFailResponseTime = 'n'
                        console.log( await failController.changeFailStatus(miner.ip, miner.hashboardFail ))
                }
        
                // fan error solved
                if(prevMiners[miner.ip].fanFail && !miner.fanFail){
                        miner.fanFailResponseTime = 0,
                        miner.formatFanFaillResponseTime = 'n'
                        console.log( await failController.changeFailStatus(miner.ip, miner.fanFail ))
                }
        
                if(prevMiners[miner.ip].tempM95 && miner.tempM95){
                        miner.tempM95ResponseTime = prevMiners[miner.ip].tempM95ResponseTime +  (new Date() - prevMiners[miner.ip].lastScan / 1000);
                        miner.formatTempM95ResponseTime = formatResponseTime(miner.tempM95ResponseTime)
                }
        
                if(prevMiners[miner.ip].tempM95 && !miner.tempM95){
                        miner.tempM95ResponseTime = 0,
                        miner.formatTempM95ResponseTime = 'n'
        
                }

                //new errors

                
                // new hashboardFail 
                if(!prevMiners[miner.ip].hashboardFail && miner.hashboardFail) {

                    console.log(await failController.createFail(miner.U, miner.hashboardFail, miner.ip, 'hashboardFail'))
                
                }

                // new fanFail 
                if(!prevMiners[miner.ip].fanFail && miner.fanFail) {

                    console.log(await failController.createFail(miner.U, miner.fanFail, miner.ip, 'fanFail'))
                
                }
        
                //const updatedMiner = await Miner.findOneAndUpdate({ip: miner.ip}, miner)
        
                return miner
                newMiners.push(miner)
        
        
                //const newMiner = await Miner.create(miner)
        
        
            }
        
            else{
                try {

                    // new errors in new miners 

                    if (miner.fanFail) {
                        
                        await failController.createFail(miner.U, miner.fanFail, miner.ip, 'fanFail')
                        //console.log(await failController.createFail(miner.U, miner.fanFail, miner.ip, 'fanFail'))

                    }

                    if(miner.hashboardFail) {

                        await failController.createFail(miner.U, miner.hashboardFail, miner.ip, 'hashboardFail')
                    
                    }

                    return miner
                    console.log('new miner');
                    newMiners.push(miner)
                    //const newMiner = await Miner.create(miner)
                } catch (error) {
                    console.log(error);
                    console.log(miner.ip);
                }
            }
        

        
            delete prevMiners[miner.ip];
             console.log(index,' ', miner.ip);
            // console.log('prevminers', Object.keys(prevMiners).length)

            if ((index+1) === miners.length) {
                console.log('done');
            }
        })
    
    const deleteOldMiiners = await Miner.remove()

    const ho = await Promise.all(res)

    console.log(ho);

    console.log('deleted stuff ', deleteOldMiiners);
    if (deleteOldMiiners) {
        console.log('newminers',newMiners.length);
        ho.forEach(miner => {
                Miner.create(miner)
        })
        // newMiners.forEach(async (miner) => {
        //     await Miner.create(miner)
        // })
    }

    //console.log('here', Object.keys(prevMiners).length);
    // for (const miner in prevMiners) {
    //     const removedMiner = await Miner.deleteOne({ip: prevMiners[miner].ip});
    //     console.log('removed miner', miner);
    // }

} catch (error) {
    console.log(error);
}
    
    
};

exports.getMinersByFase = async (req,res) => {

    const latestScanRegister = await ScanRegister.find().sort({$natural:-1}).limit(1);

    const miners = await Miner.find({U: req.params.fase});

    res.status(200).json({
        status: "success",
        miners
    })

}

exports.createMinerStatusRegister  = async (req,res) => {

    console.log('enter the route');

    console.log(req.body.scanId);

    // const {scanId, resolvedMiners} = req.body

    // saveMiner2(resolvedMiners, scanId)

    const {scanId, Us, minerCount} = req.body

    console.log(Us[0].length);
    saveMiner4(Us, scanId, minerCount)

    //console.log(req.body.resolvedRacks[0].scanedMiner,"  racks scaned");

    // const minersObj = toObj(req.body.resolvedRacks[0].scanedMiner)


    // //const resolvedRacks = req.body;

    // const {multiErrorApparences,noErrorMiners } = await addMinersToDB2(minersObj)

    // let minersWithError= multiErrorApparences.concat((await addNewMinersWithErrors(minersObj)))

    // addMultiErrorApparencesMiners(multiErrorApparences)

    // resetMinerErrorsApparences(noErrorMiners)

    // resolvedRacks.forEach(async (rack) => {

    //     const deletedPreviusMinersInIpRange = await Miner.deleteMany({ipRange: rack.ipRange})
        
    //     rack.scanedMiner.forEach(async (miner) => {
    //        try {

    //         const newMiner = await Miner.create(miner)

    //        } catch (e) {
    //            console.log("error creating the miner");
    //        }
    //     })

    // });

    res.status(200).json({
    status: "success"
    })
}

exports.getAvgresponseTime = async (req,res) => {


    const responseTime = await Miner.find({U:req.params.fase, hashboardFail:{$gt:0}} )
      
    let AvgresponseTimeHashboard = 0

    let AvgresponseTimeFan = 0

    responseTime.forEach((miner) => {

        AvgresponseTimeHashboard += miner.hashboardFailResponseTime;
    })

    AvgresponseTimeHashboard=AvgresponseTimeHashboard/responseTime.length;

    console.log(responseTime.length);

    res.status(200).json({
    status: "success",
    AvgresponseTimeHashboard: AvgresponseTimeHashboard
    })
}

exports.getAvgfanFailResponseTime = async (req,res) => {


    const responseTime = await Miner.find({U:req.params.fase, fanFail:{$gt:0}} )
      

    let AvgresponseTimeFan = 0

    responseTime.forEach((miner) => {

        AvgresponseTimeFan+= miner.fanFailResponseTime;
    })

    AvgresponseTimeFan =AvgresponseTimeFan/responseTime.length;


    res.status(200).json({
    status: "success",
    AvgresponseTimeFan:AvgresponseTimeFan
    })
}
