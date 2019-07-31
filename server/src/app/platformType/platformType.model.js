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
  var platformTypeSchema = new Schema({
    name: {
      type: String,
      unique: true,
      required: true
    },
    
    
    

   
  });

  /**
   * On every save...
   */
  platformTypeSchema.pre('save', function(next) {
    
    next();
    
  });

  


  /**
   * Schema plugins
   */
  platformTypeSchema.plugin(mongoosePaginate);

  /**
   * Schema methods
   */


  // create model
  var PlatformType = mongoose.model('PlatformType', platformTypeSchema);

  // public
  module.exports = PlatformType;


})();
