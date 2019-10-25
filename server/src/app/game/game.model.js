;(function() {

  'use strict';

  /**
   * Define Game model
   */
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;
  var mongoosePaginate = require('mongoose-paginate');
  

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
      default: 'Game'
      
    },
    gameType: {
      type: String,
      // required: true,
      default: '1V1'
    },
    platform: {
      type: String,
      required: true,
     
    },

    buyIn: {
      type: Number,
      default: 0,
     
    },
    players: {
      type: [{
        userName: String,
        userId: ObjectId
        
      }],
      default: [],
     
    },
    playersPerGroup: {
      type: Number,
      default: 1,
     
    },
    optionalPlayers: {
      type: [{
        userName: String,
        userId: ObjectId
        
      }],
      default: [],
     
    },
    winner: {
      type: {
        userName: String,
        userId: ObjectId
        
      },
      default: {},
     
    },
    time: {
      type: Date,
      default: Date.now()
    },

    timeOptions: {
      type: [timeOptionSchema],
      default: {}
    },
    host: {
      type: String,
      // required: true,
    },
    privacy: {
      type: String,
      default: 'public'
    },
    maxPlayers: {
      type: Number,
      default: 2
    },
    gameGroups: {
      type: [{
      groupNumber: Number,
      groupMembers: [{
        userName: String}],
      }],  
      default: []
    },
    group: {
      groupId: ObjectId,
      groupName: String
      
    },
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
