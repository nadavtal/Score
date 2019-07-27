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
  var platformSchema = new Schema({
    name: {
      type: String,
      unique: true,
      required: true
    },
    type: String,
    
    

   
  });

  /**
   * On every save...
   */
  platformSchema.pre('save', function(next) {
    var game = this;
    next();
    
  });

  


  /**
   * Schema plugins
   */
  platformSchema.plugin(mongoosePaginate);

  /**
   * Schema methods
   */


  // create model
  var Platform = mongoose.model('Platform', platformSchema);

  // public
  module.exports = Platform;


})();
