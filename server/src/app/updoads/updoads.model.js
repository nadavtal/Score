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
  var uploadSchema = new Schema({
    file: {
      type: Object,
      required: true,
      
    },
    userId: ObjectId,
    groupId: ObjectId,
    
    
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
  uploadSchema.pre('save', function(next) {
    var user = this;

    next();
  });

  


  /**
   * Schema plugins
   */
  uploadSchema.plugin(mongoosePaginate);

  /**
   * Schema methods
   */
  

  // create model
  var Upload = mongoose.model('Upload', uploadSchema);

  // public
  module.exports = Upload;


})();
