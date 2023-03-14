exports.getFilters = (reqQuery) => {
    console.log(`enter ${reqQuery} queryFilter `);
    let queryFilter = {
        filter: {
        },
        opts: {}
    }    
    if (reqQuery['Date']) queryFilter.filter['Date'] = {}
    
    Object.keys(reqQuery).forEach(( queryProp) => {
        if( !queryProp.includes('Date') && !queryProp.includes('limit') && reqQuery[queryProp] !== "todas") {
            queryFilter.filter[queryProp] = reqQuery[queryProp]
        }
        if(queryProp.includes('Date')){
            queryFilter.filter['Date'][queryProp.includes('start') ? `$gt` : `$lt`]  = new Date(reqQuery[queryProp])
        }
        if(queryProp.includes('limit')){
            queryFilter.opts.limit =  reqQuery[queryProp]
        }
    })

    console.log(queryFilter);
    return queryFilter
}