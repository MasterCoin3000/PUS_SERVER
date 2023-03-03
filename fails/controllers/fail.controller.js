const Fail = require('../model/fail.model');

const formatResponseTime = (minutes) => {
    
    if(minutes >= 60 && minutes < 1440) {
        return `${Math.trunc(minutes / 60)}h`
    }

    else if(minutes >= 1440 ){
        return `${Math.trunc(minutes / 1440)}d`
    }

    else {
        return `${Math.trunc(minutes)}m`
    }


}

const createFail = async (location, currentFail, ip, type ) => {

    const startDate = new Date();
    const status = 'pending';
    const before = currentFail

    const newFail = await Fail.create({location, startDate, before, ip, status, type})

    return newFail

}

const changeFailStatus = async (ip, solvedFail) => {

    const filter = {ip}

    const fail = await Fail.findOne({ip: ip})



    fail.endDate = new Date();
    fail.responseTimeMs = fail.endDate - fail.startDate;
    fail.formateResponseTime = formatResponseTime((fail.responseTimeMs/1000/60))
    fail.after = solvedFail;
    fail.status = 'resolved'

    await fail.save()


    // const updateValues = {endDate, responseTimeMs, formateResponseTime, after, status};

    // const updatedMiner = await Fail.findOneAndUpdate(filter, updateValues)

}

module.exports = {
    createFail,
    changeFailStatus
}