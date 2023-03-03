const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/RPS', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log(" we're connected!! ");
});

const columnFormat = (minerExample) => {
    let res = []
    for (const key in minerExample) {
        res.push({ header: key, key: key })
    }
    return res
}

const Miner = require("./Miner/model/miner.model"); 

const ExcelJS = require('exceljs');

const workbook = new ExcelJS.Workbook();

workbook.created = new Date();
workbook.modified = new Date();
workbook.lastPrinted = new Date();

const fases=['F0U2','F1U1','F1U2','F1U3','F1U4',
             'F2U1','F2U2','F2U3','F2U4','F2U5','F2U6','F2U7','F2U8',
             'F3U1','F3U2','F3U3','F3U4',
             'F4U1','F4U2','F4U3','F4U4','F4U5',
             'F5U1','F5U2','F5U3','F5U4']

const toExcel = async () => {

    const sampleMiner = await Miner.findOne()

    console.log(sampleMiner._doc);
    
    console.log(columnFormat(sampleMiner._doc));

    return fases.map(async (fase) => {
    
        const sheet = workbook.addWorksheet(`${fase}`);

        sheet.columns = columnFormat(sampleMiner._doc)
    
        const miners = await Miner.find({U: fase , $or: [ {hashboardFail : { $gte: 1 }} , {fanFail : { $gte: 1 }}  ]  });
 
        // const miners = db.inventory.find({
        //       hashboardFail:  1 , 
        //        U: fase 
        //      } )
    
        miners.forEach(miner => {
            sheet.addRow(miner);
        });
    
    
    });
}

const toExcel2=async (mineObj)=>{
    const wb = new Excel.Workbook();
    const wb2 = new Excel.Workbook();
    await wb.xlsx.readFile(inputExcel);
    
    const mac3hashfail = await Miner.find({U: fase , hashboardFail : 3 });
    const mac3hashfail = await Miner.find({U: fase , hashboardFail : 2 });
    const mac1hashfail = await Miner.find({U: fase , hashboardFail : 1 });


    
    mineObj.forEach(objU=>{
        let rowCounter=1;
        const numberU=parseInt(objU[0].nameU.substring(3));
        const nameSheet=objU[0].nameU.substring(0,2);
        const coordenada=(numberU<5?(17*numberU-7):(17*numberU+4))
        const ws2=wb2.addWorksheet(objU[0].nameU)
            const ws = wb.getWorksheet(nameSheet);
            let row = ws.getRow(coordenada);
            row.getCell(2).value = 10000; 
            row = ws.getRow(coordenada+1);
            //row.getCell(2).value = objU[0].totalMacInstaledCount;
            row.getCell(2).value = 9999;
            row = ws.getRow(coordenada+2);
            //row.getCell(2).value = objU[0].empty;
            row.getCell(2).value = 9999;
            row = ws.getRow(coordenada+3);
            //row.getCell(2).value = objU[0].mac3hashfail;
            row.getCell(2).value = mac3hashfail;
            row = ws.getRow(coordenada+4);
            //row.getCell(2).value = objU[0].mac2hashfail;
            row.getCell(2).value = mac2hashfail;
            row = ws.getRow(coordenada+5);
            //row.getCell(2).value = objU[0].mac1hashfail;
            row.getCell(2).value = mac1hashfail;
            row = ws.getRow(coordenada+6);
            row.getCell(2).value = parseFloat(objU[0].totalHashRateInstaled/1000).toFixed(2);
            row = ws.getRow(coordenada+7);
            row.getCell(2).value = parseFloat(objU[0].totalHashRateScaned/1000).toFixed(2);
            row = ws.getRow(coordenada+8);
            row.getCell(2).value = objU[0].reboot_1h;
            row = ws.getRow(coordenada+9);
            row.getCell(2).value = objU[0].reboot_24h;;
            row = ws.getRow(coordenada+10);
            row.getCell(2).value = objU[0].tempM95;;
            
            
            let ObjWork=Object.assign({},objU[0].totalMacScan)
           
            Object.keys(objU[0].totalMacInstaled).forEach(type=>{
                if(!ObjWork[type]){
                    ObjWork[type]=objU[0].totalMacInstaled[type]
                }
            })
            


            let controlErrorLoop=0;
            Object.keys(ObjWork).forEach((typeM,i)=>{
                if(typeM=='Error'){
                    controlErrorLoop=-1;
                    return
                }
                row = ws.getRow(coordenada+3+i+controlErrorLoop);
                row.getCell(3).value =typeM;
                row.getCell(4).value = (objU[0].totalMacInstaled[typeM]?objU[0].totalMacInstaled[typeM]:null);
                row.getCell(5).value = (objU[0].totalMacScan[typeM]?objU[0].totalMacScan[typeM]:null);
                row.getCell(6).value =(objU[0].totalHashFailPerModel[typeM]?objU[0].totalHashFailPerModel[typeM]:null);
                row.getCell(7).value =(objU[0].totalFanPerModel[typeM]?objU[0].totalFanPerModel[typeM]:null); 
            })
            row = ws.getRow(coordenada+3);
            row.getCell(9).value =(objU[0].totalMacScan.Error?objU[0].totalMacScan.Error:0);                   
            row.commit();
            
            
            let row2 = ws2.getRow(rowCounter);
            const headerTable=Object.keys(objU[1][0])
            row2 = ws2.getRow(rowCounter); 
            headerTable.forEach((head,colCounter)=>{
                row2.getCell(1+colCounter).value=head
            })
            ws2.autoFilter = {
                from: {
                  row: rowCounter,
                  column: 1
                },
                to: {
                  row: rowCounter,
                  column: headerTable.length
                }
              }
            rowCounter++;
            objU[1].forEach(miner=>{
                //if(miner.aliasModel!='client'){
                if((miner.hashboardFail!=0 || miner.fanFail!=0) && miner.aliasModel!='client'){
                    row2 = ws2.getRow(rowCounter);                 
                    Object.keys(miner).forEach((property,colCounter)=>{ 
                        row2.getCell(1+colCounter).value=miner[property]
                    });
                    row2.commit();
                    rowCounter++;
                }
             })
    })
    wb.xlsx.writeFile(outputExcel)
    //fileErrors=path.join(__dirname,carpeta,'/'+'errors.xlsx')
    wb2.xlsx.writeFile('fileErrors.xlsx') 
};

const writeExcel = async () => {
    const res = await toExcel();

    Promise.allSettled(res).then((data) => {
            workbook.xlsx
            .writeFile('otro.xlsx')
            .then(() => {
              console.log('file created');
            })
            .catch(err => {
              console.log(err.message);
            });
        })
}

writeExcel()