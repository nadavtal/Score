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
  var gameTypeSchema = new Schema({
    name: {
      type: String,
      unique: true,
      required: true
    },
    
    
    

   
  });

  /**
   * On every save...
   */
  gameTypeSchema.pre('save', function(next) {
    
    next();
    
  });

  


  /**
   * Schema plugins
   */
  gameTypeSchema.plugin(mongoosePaginate);

  /**
   * Schema methods
   */


  // create model
  var GameType = mongoose.model('GameType', gameTypeSchema);

  // public
  module.exports = GameType;


})();
