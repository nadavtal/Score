;(function() {

  'use strict';

  /**
   * game endpoint controller
   * @desc Handler functions for all /game routes
   */
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var Message = require('./message.model.js');

  
  var config = require('../../config/config.js');
  var utils = require('../utils/utils.js');


  // public
  module.exports = {
    createMessage,
    getAllMessages,
    getMessage,
    updateMessage,
    getMessagesByGroupId,
    removeMessage,
    getMessagesByUserID
  };

  /// definitions

   /**
   * Create new game
   * POST '/games'
   */
  function createMessage(req, res, next) {
    var params = req.body;
    console.log('creating message', params)
    if(params.messageType == 'groupMessage'){
      console.log('this is a groupMessage')
    } 
    var message = new Message({
      subject : params.subject,
      content: params.content,
      messageType : params.messageType,
      sender : params.sender,
      receiver : params.receiver,
      links: params.links,
      replies: [],
      parentMessageId: params.parentMessageId

      
    });
    console.log(message)
    // req params validation for required fields
    // req.checkBody('name', 'name must be defined').notEmpty();
    
    // validate user input
    var errors = req.validationErrors();
    if (errors) {
      console.log('error in creating message')
        utils.sendJSONresponse(res, 400, errors);
        return;
    }

    message.save((err, newMessage) => {
      console.log('saving message', newMessage)
      if (err) return next({ err: err, status: 400 });
      if (!newMessage) return next({ message: 'Message not created.', status: 400 });

      utils.sendJSONresponse(res, 201, newMessage);
    });
    
    
  }

  function updateMessage(req, res, next) {
    
    var bodyParams = req.body;
    
    console.log('message body params', bodyParams)

    Message
      .findOneAndUpdate(
        { _id: ObjectId(bodyParams._id) },
        { '$set': {
          'subject' : bodyParams.subject,
          'content': bodyParams.content,
          'messageType' : bodyParams.messageType,
          'sender' : bodyParams.sender,
          'receiver' : bodyParams.receiver,
          'links': bodyParams.links,
          'status': bodyParams.status,
          'replies': bodyParams.replies,
          'parentMessageId': bodyParams.bodyParams 
 }
        },
        { upsert: false, new: true, fields: { password: 0 }, runValidators: true, setDefaultsOnInsert: true })
      .exec((err, message) => {
        if (err) return next({ err: err, status: 400 });
        if (!message) return next({
          message: 'message not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 200, message);
      });
  }

  /**
   * Get games (paginated)
   * GET '/games/'
   */
  function getAllMessages(req, res, next) {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;


    // Message.find({}, function (err, games) {
    //   res.send(games);
    // });

    var options = {
        page: 1,
        limit: 1000,
        lean: true
    };



    Message.paginate({}, options, (err, games) => {
      // console.log(games)
      if (err) return next(err);
      if (!games) return next({
        message: 'No games found.',
        status: 404
      });

      var pagination = {
        pageNumber: games.page,
        itemsPerPage: games.limit,
        prev: res.locals.paginate.href(true),
        next: res.locals.paginate.href(),
      };

      utils.sendJSONresponse(res, 200, games, false, pagination);
    });
  }

  /**
   * Get games by user
   * GET '/games/:userId'
   */

   function getMessagesByUserID(req, res, next){
     var params = req.params;
      console.log('getting messages of userID: ', params.userId)
     Message
        .find({$or:[{'receiver.userId':  params.userId}, {'sender.userId' : params.userId}]})
        
        .exec((err, games) => {
          if (err) return next(err);
          if (!games) return next({
            message: 'game not found.',
            status: 404
          });
  
          utils.sendJSONresponse(res, 200, games);
        });
   }
   function getMessagesByGroupId(req, res, next){
     var params = req.params;
      console.log('getting messages of groupId: ', params.groupId)
     Message
        .find({$or:[{'receiver.userId':  params.groupId}, {'sender.userId' : params.groupId},  {'links.groupId' : params.groupId}]})
        
        .exec((err, messages) => {
          if (err) return next(err);
          if (!messages) return next({
            message: 'message not found.',
            status: 404
          });
  
          utils.sendJSONresponse(res, 200, messages);
        });
   }

   

   /**
   * Get games by gameID
   * GET '/games/:gameId'
   */
  function getMessage(req, res, next) {
    var params = req.params;

    Message
      .findOne({ '_id': ObjectId(params.gameId) }, { password: 0, __v: 0 })
      .exec((err, game) => {
        if (err) return next(err);
        if (!game) return next({
          message: 'game not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 200, game);
      });
  }

  function removeMessage(req, res, next){
    console.log('removing game')
    var params = req.params;
    console.log('removing game',params.gameId)
    Message
      .update({ _id: params.gameId }, { "$pull": { "gameId": params.gameId } }, { safe: true, multi:true }, function(err, obj) {
      //do something smart
      console.log(obj)
      if (err) return next(err);
      if (!obj) return next({
        message: 'obj not found.',
        status: 404
      });

      utils.sendJSONresponse(res, 200, obj);
  });
    
  }

  /**
   * Update game
   * PUT '/games/:userId'
   */
 


  

  /**
   * Middleware for checking if user is admin
   */
  function isAdmin(req, res, next) {
    var user = req.user;
    var isAdmin = user && user.role === 'admin';

    if (isAdmin)
      next();
    else
      return next({
        status: 403,
        message: 'Forbidden access',
        name: 'forbiddenaccess'
      });
  }

})();
