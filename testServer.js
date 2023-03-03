const express = require('express')
const app = express()
const port = 3500;
const cors = require("cors");
const path = require("path");

app.use(cors())
app.use(express.json({limit: '50mb'}));

const mongoose = require('mongoose');

var connectWithRetry = function() {
  return mongoose.connect('mongodb://localhost/RPS', function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    }
  });
};

//let isConnectedBefore = false


connectWithRetry();

mongoose.connection.on('error', function() {
    console.log('Could not connect to MongoDB');
    connectWithRetry();
});

mongoose.connection.on('disconnected', function(){
    console.log('Lost MongoDB connection...');
    if (!isConnectedBefore) {
      console.log('traying reconect');
      connectWithRetry();
    }
});
mongoose.connection.on('connected', function() {
    isConnectedBefore = true;
    console.log('Connection established to MongoDB');
});

// mongoose.connection.on('reconnected', function() {
//     console.log('Reconnected to MongoDB');
// });



// db.once('open', function() {
//   // we're connected!
//   console.log(" we're connected!! ");
// });




const ipRangesRoutes = require("./ipRanges/routes.config");
const minerRoutes = require("./Miner/routes.confid");
const scanRegisterRoutes = require('./scan-register/routes.config')

app.use("/ipRanges", ipRangesRoutes);
app.use("/minerRegister", minerRoutes);
app.use("/scanRegister", scanRegisterRoutes);

app.use('/test', (req, res) => {

  console.log(req);
})


app.listen(3555, () => {
  console.log(`listening on port 3555`)
})