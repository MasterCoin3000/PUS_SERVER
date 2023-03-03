// const mongoose = require('mongoose');
// const PoolRegisters = require("./pools.model");


// // mongoose.connect('mongodb://localhost/CoinCoin', {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true
// // });

// // const connectionSafe = async ()=>{
// //   while(true){
// //       try{
// //           const db = mongoose.connection
// //           return db
// //       }catch (e){
// //           console.log("disconected",e)
// //       }      
// //   }     
// // }

// // const db = mongoose.connection;
// // db.on('error', console.error.bind(console, 'connection error:'));
// // db.once('open', function() {
// // console.log("Conectados!! ");
// // });


// // const run=async ()=>{
// //   const db = await connectionSafe();
// //   db.on('error', console.error.bind(console, 'connection error:'));
// //   db.once('open', ()=> {
// //   console.log("Conectados!!");
// //   });
  
// // }

// // run()

// var connectWithRetry = function() {
//   return mongoose.connect('mongodb://localhost/test', function(err) {
//     if (err) {
//       console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
//       setTimeout(connectWithRetry, 5000);
//     }
//   });
// };


// connectWithRetry();

// mongoose.connection.on('error', function() {
//     console.log('Could not connect to MongoDB');
//     connectWithRetry();
// });

// mongoose.connection.on('disconnected', function(){
//     console.log('Lost MongoDB connection...');
//     if (!isConnectedBefore) {
//       console.log('traying reconect');
//       connectWithRetry();
//     }
// });
// mongoose.connection.on('connected', function() {
//     isConnectedBefore = true;
//     console.log('Connection established to MongoDB');
// });


// setTimeout(async () => {

            
//             const explain = await PoolRegisters.find({
//                 Date: {
//                     $gt: '2022-12-29T16:27:00.000Z',
//                     $lt: '2022-12-30T16:27:00.000Z'
//             }})

//             console.log(explain)
        
//        // }
    
    
// }, 10000);



const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test');

const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));

mongoose.connection.on('connected', function() {
    isConnectedBefore = true;
    console.log('Connection established to MongoDB');
});

connection.once('open', async function () {

  const collection  = connection.db.collection("poolregisters");
  collection.find({ Date: { $gt: '2022-12-29T16:27:00.000Z', $lt: '2022-12-30T16:27:00.000Z' }}).toArray(function(err, data){
    console.log(data); // it will print your collection data
})
  // const res = await collection.find();
  // console.log(res[0])

  console.log('bitch better have my money')

});