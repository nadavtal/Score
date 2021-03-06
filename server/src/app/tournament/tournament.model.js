;(function() {

  'use strict';

  /**
   * Define tournament model
   */
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;
  var mongoosePaginate = require('mongoose-paginate');
  
  /**
   * tournament schema definition
   */
  var timeOptionSchema = new Schema({
    date: Date,
    players: [{
      userName: String,
      userId: ObjectId
      
    }],
  })


  var tournamentSchema = new Schema({
    name: {
      type: String,
    },
    manager: {
      userName: String,
      userId: ObjectId
    },
    platform: {
      type: String,
      required: true,
     
    },
    maxPlayers: Number,
    playerPerBattle: Number,
    rounds: Number,
    buyIn: Number,
    placesPaid: Number,
    winsToWinRound: Number,
    winner: {
      userName: String,
      userId: ObjectId
    },
    registered: [{
      userName: String,
      userId: ObjectId
    }],
    prizePool: Number,
    optionalPlayers: [{
      userName: String,
      userId: ObjectId      
    }],
    winners: [{
      position: Number,
      percentage: Number,
      prize: Number,
      userName: String,
      userId: String
    }],
    time: {
      type: Date,
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
    tree: String,
    privacy: {
      type: String,
      enum: {
        values: ['public', 'friends', 'group', 'private'],
        message: 'Only "public", friends", "group", private",  messages are allowed.'
      }
    },
    active: {
      type: Boolean,
      default: true
    },
    inActiveReason: String,
    lastActiveDate: Date
  });

  /**
   * On every save...
   */
  tournamentSchema.pre('save', function(next) {
    var tournament = this;
    next();
    
  });

  tournamentSchema.pre('findOneAndUpdate', function(next) {
    var tournament = this;

    // update updateAt value
    var currentDate = new Date();
    tournament.update({}, { $set: { updatedAt: currentDate } });
    next();
  });


  /**
   * Schema plugins
   */
  tournamentSchema.plugin(mongoosePaginate);

  /**
   * Schema methods
   */


  // create model
  var tournament = mongoose.model('tournament', tournamentSchema);

  // public
  module.exports = tournament;


})();
