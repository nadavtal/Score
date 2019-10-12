;(function() {

  'use strict';

  /**
   * Define Game model
   */
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;
  
  var mongoosePaginate = require('mongoose-paginate');
  

  /**
   * Game schema definition
   */
  var accountSchema = new Schema({
    platform: {
      type: String,
      required: true
    },
    accountType: {
      type: String,
      required: true,
      default: 'user'
    },
    userName: {
      type: String,
      required: true
    },
    
    accountId: {
      type: String,
      
    },
    userId: ObjectId,
    active: {
      type: Boolean,
      default: true
    },
    inActiveReason: String,
    lastActiveDate: Date
  })

  /**
   * On every save...
   */
  accountSchema.pre('save', function(next) {
    var game = this;
    next();
    
  });

  


  /**
   * Schema plugins
   */
  accountSchema.plugin(mongoosePaginate);

  /**
   * Schema methods
   */


  // create model
  var Account = mongoose.model('Account', accountSchema);

  // public
  module.exports = Account;


})();
