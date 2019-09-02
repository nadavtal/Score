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
        values: ['groupInvite', 'groupMessage', 'gameInvite', 'privateChatMessage', 'groupChatMessage', 'systemMessage', 'friendRequest', 'tournamentInvite'],
        message: 'Only "groupInvite", "groupMessage", gameInvite", "privateChatMessage", "groupChatMessage", systemMessage" , "friendRequest", "tournamentInvitey", messages are allowed.'
      }
    },
    sender: {
      userName: String,
      userId: ObjectId
    },
    receiver: {
      userName: String,
      userId: ObjectId
    },
    sentdAt: {
      type: Date,
      default: Date.now
    }, 
    status: {
      type: String,
      enum: {
        values: ['read', 'unread', 'draft'],
        message: 'Only "read", "unread" "draft" messages are allowed.',
        
      },
      default: 'unread'
    },
    links: {
      type: Object,
      default: {}
    }
    
    

   
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
