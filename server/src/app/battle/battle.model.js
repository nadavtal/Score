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
  


  var battleSchema = new Schema({
    type: String,
    battleTime: String,
    gameMode: String,
    clan: String,
    team: [{
      tag: String,
      name: String,
      crowns: Number
    }],
    opponent: [{
      tag: String,
      name: String,
      crowns: Number
    }],
    winner: String,
    

   
  });

  /**
   * On every save...
   */
  battleSchema.pre('save', function(next) {
    var game = this;
    next();
    
  });

  


  /**
   * Schema plugins
   */
  battleSchema.plugin(mongoosePaginate);

  /**
   * Schema methods
   */


  // create model
  var Battle = mongoose.model('Battle', battleSchema);

  // public
  module.exports = Battle;


})();
