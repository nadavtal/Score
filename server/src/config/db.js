;(() => {

  'use strict';

  var mongoose = require('mongoose');
  var config = require('./config.js');
  var ENV = process.env.NODE_ENV || 'developement';
  var DB_URI = config.db[ENV].url;
//   const path = require('path');
//   const crypto = require('crypto');
//   const multer = require('multer');
//   const GridFsStorage = require('multer-gridfs-storage');
//   const Grid = require('gridfs-stream');
//   const methodOverride = require('method-override');

  console.log(DB_URI);
  
//   let gfs;

  // set mongoose.Promise to native ES6 Promise implementation
  mongoose.Promise = Promise;
//   var conn = mongoose.createConnection(DB_URI);
  mongoose.connect(DB_URI);

  // connection events
  mongoose.connection.on('connected', () => {
      console.log(`Mongoose connected to ${DB_URI}`);

    
  });
  

  mongoose.connection.on('error', (err) => {
      console.log(`Mongoose connection error: ${err}`);
  });
 

  mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
  });

  mongoose.connection.once('open', (err, data) => {
    // console.log('Mongo working!', mongoose.connection.db);
    mongoose.connection.db.listCollections().toArray(function (err, collectionNames) {
        // console.log(collectionNames); // [{ name: 'dbname.myCollection' }]
        module.exports.Collection = collectionNames;
    });

    function removeCollection(collctionName){
        mongoose.connection.db.dropCollection(collctionName, function(err, result) {

        });
    }
    // removeCollection('games');
    // removeCollection('uploads');
    // removeCollection('uploads.files');
  });

  // for nodemon restarts
  process.once('SIGUSR2', () => {
      gracefulShutdown('nodemon restart', () => {
          process.kill(process.pid, 'SIGUSR2');
      });
  });

  // for app termination
  process.on('SIGINT', () => {
      gracefulShutdown('app termination', () => {
          process.exit(0);
      });
  });

  /// definitions

  // capture app termination / restart events
  // To be called when process is restarted or terminated
  function gracefulShutdown(msg, cb) {
      mongoose.connection.close(() => {
          console.log(`Mongoose disconnected through ${msg}`);
          cb();
      });
  }

})();