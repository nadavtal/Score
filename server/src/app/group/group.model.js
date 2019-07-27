;(function() {

  'use strict';

  /**
   * Define user model
   */
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;
  var bcrypt = require('bcryptjs');
  var SALT_WORK_FACTOR = 10;
  var mongoosePaginate = require('mongoose-paginate');
  var userHelpers = require('./group.helpers.js');
  var Game = require('../game/game.model')
  var User = require('../user/user.model')
  /**
   * User schema definition
   */
  var groupSchema = new Schema({
    groupName: {
      type: String,
      required: true,
      
    },
    groupManager: {
      userName: String,
      userId: ObjectId
    },
    
    password: {
      type: String,
      default: '',
      required: false,
    },

    groupImage: String,
    
    wins: {
      type: Number,
      default: 0
    },
    gamesHistory: {
      type: Array,
      default: []
    },
    
    members: [{
      userName: String,
      userId: ObjectId
    }],
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
  groupSchema.pre('save', function(next) {
    var user = this;

    next()
  });

  groupSchema.pre('findOneAndUpdate', function(next) {
    var user = this;

    // update updateAt value
    var currentDate = new Date();
    user.update({}, { $set: { updatedAt: currentDate } });
    next();
  });


  /**
   * Schema plugins
   */
  groupSchema.plugin(mongoosePaginate);

  /**
   * Schema methods
   */
  groupSchema.methods.comparePassword = groupSchema.comparePassword;

  // create model
  var Group = mongoose.model('Group', groupSchema);

  // public
  module.exports = Group;


})();
