;(function() {

  'use strict';

  /**
   * Define user model
   */
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId
  var bcrypt = require('bcryptjs');
  var SALT_WORK_FACTOR = 10;
  var mongoosePaginate = require('mongoose-paginate');
  var userHelpers = require('./user.helpers.js');
  var Account = require('../account/account.model');
  var Message = require('../message/message.model')

  
  // var Game = require('../game/game.model')
  /**
   * User schema definition
   */
  var userSchema = new Schema({
    userName: {
      type: String,
      required: true,
      unique: true
    },
    firstName: {
      type: String,
      trim: true,
      default: ''
    },
    surname: {
      type: String,
      trim: true,
      default: ''
    },
    password: {
      type: String,
      default: '',
      required: true,
    },
    email: {
      type: String,
      default: '',
      // unique: true
    },
    role: {
      type: String,
      default: 'user',
      enum: {
        values: ['user', 'admin', 'group-manager'],
        message: 'Only "user","admin" or group-mmanager roles are allowed.'
      }
    },
    wins: {
      type: Number,
      default: 0
    },
    gamesHistory: {
      type: Array,
      default: []
    },
    groups: {
      type: Array,
      default: []
    },
    friends:[{
      userName: String,
      userId: ObjectId
      
    }],
    profileImageFileName: {
      type: String,
      default: ''
    },
    profileImageLink: String,
    accounts: [Account.schema],
    messages: [Message.schema],
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
  userSchema.pre('save', function(next) {
    var user = this;

    userHelpers.hashPassword(user, () => {
      userHelpers.setTimestamps(user, next);
    });
  });

  userSchema.pre('findOneAndUpdate', function(next) {
    var user = this;

    // update updateAt value
    var currentDate = new Date();
    user.update({}, { $set: { updatedAt: currentDate } });
    next();
  });


  /**
   * Schema plugins
   */
  userSchema.plugin(mongoosePaginate);

  /**
   * Schema methods
   */
  userSchema.methods.comparePassword = userHelpers.comparePassword;

  // create model
  var User = mongoose.model('User', userSchema);

  // public
  module.exports = User;


})();
