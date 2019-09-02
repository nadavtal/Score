;(function() {

  'use strict';

  /**
   * Define user model
   */
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;
  
  var mongoosePaginate = require('mongoose-paginate');
  
  
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
    mainPlatform: {
      platformName: String,
      
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
