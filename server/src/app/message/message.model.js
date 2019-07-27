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
  var messageSchema = new Schema({
    subject: {
      type: String,
      
    },
    content: String,
    messageType: {
      type: String,
      enum: {
        values: ['groupInvite', 'gameInvite', 'chatMessage', 'systemMessage'],
        message: 'Only "groupInvite", "gameInvite", "chatMessage", "systemMessage" messages are allowed.'
      }
    },
    sender: {
      userName: String,
      iserId: ObjectId
    },
    receiver: {
      userName: String,
      iserId: ObjectId
    },
    sentdAt: {
      type: Date,
      default: Date.now
    }, 
    
    

   
  });

  /**
   * On every save...
   */
  messageSchema.pre('save', function(next) {
    var game = this;
    next();
    
  });

  


  /**
   * Schema plugins
   */
  messageSchema.plugin(mongoosePaginate);

  /**
   * Schema methods
   */


  // create model
  var Message = mongoose.model('Message', messageSchema);

  // public
  module.exports = Message;


})();
