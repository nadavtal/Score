;(function() {

  'use strict';

  /**
   * Define Game model
   */
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;
  // console.log('ObjectId', ObjectId)
  var bcrypt = require('bcryptjs');
  var SALT_WORK_FACTOR = 10;
  var mongoosePaginate = require('mongoose-paginate');
  var gameHelpers = require('./game.helpers.js');

  var User = require('../user/user.model')
  // var userSchema = new User
  // console.log(userSchema)
  /**
   * Game schema definition
   */
  var timeOptionSchema = new Schema({
    date: Date,
    players: [{
      userName: String,
      userId: ObjectId
      
    }],
  })


  var gameSchema = new Schema({
    name: {
      type: String,
      
      
    },
    gameType: {
      type: String,
      required: true,
     
    },
    platformType: {
      type: String,
      required: true,
     
    },
    players: [{
      userName: String,
      userId: ObjectId
      
    }],
    optionalPlayers: [{
      userName: String,
      userId: ObjectId
      
    }],
    winner: {
      userName: String,
      userId: ObjectId
      
    },
    time: {
      type: Date,
      
      
    },

    timeoptions: [timeOptionSchema],

    host: {
      type: String,
      required: true,
    },
    group: ObjectId,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date
    },
  });

  /**
   * On every save...
   */
  gameSchema.pre('save', function(next) {
    var game = this;
    next();
    
  });

  gameSchema.pre('findOneAndUpdate', function(next) {
    var game = this;

    // update updateAt value
    var currentDate = new Date();
    game.update({}, { $set: { updatedAt: currentDate } });
    next();
  });


  /**
   * Schema plugins
   */
  gameSchema.plugin(mongoosePaginate);

  /**
   * Schema methods
   */


  // create model
  var Game = mongoose.model('Game', gameSchema);

  // public
  module.exports = Game;


})();
