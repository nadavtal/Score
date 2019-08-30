;(function() {

  'use strict';

  /**
   * game endpoint controller
   * @desc Handler functions for all /game routes
   */
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var GameType = require('./gametype.model.js');

  var bcrypt = require('bcryptjs');
  var SALT_WORK_FACTOR = 10;
  var jwt = require('jsonwebtoken');
  var config = require('../../config/config.js');
  var utils = require('../utils/utils.js');


  // public
  module.exports = {
    createGameType,
    getAllGameTypes,
    getGameType,
    updateGameType,
    removeGameType,
    getGameTypesByUserId
  };

  /// definitions

   /**
   * Create new game
   * POST '/games'
   */
  function createGameType(req, res, next) {
    console.log('creating gameType')
    var params = req.body;
    console.log(params)
    var gameType = new GameType({
      name: params.name,
      
      
    });
    console.log(gameType)
    // req params validation for required fields
    req.checkBody('name', 'name must be defined').notEmpty();
    
    // validate user input
    var errors = req.validationErrors();
    if (errors) {
      console.log('error in creating gameType')
        utils.sendJSONresponse(res, 400, errors);
        return;
    }

    gameType.save((err, newGameType) => {
      console.log('saving gameType', newGameType)
      if (err) return next({ err: err, status: 400 });
      if (!newGameType) return next({ message: 'GameType not created.', status: 400 });

      utils.sendJSONresponse(res, 201, newGameType);
    });
  }

  /**
   * Get games (paginated)
   * GET '/games/'
   */
  function getAllGameTypes(req, res, next) {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;


    // GameType.find({}, function (err, games) {
    //   res.send(games);
    // });

    var options = {
        page: 1,
        limit: 100,
        lean: true
    };



    GameType.paginate({}, options, (err, games) => {
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

   function getGameTypesByUserId(req, res, next){
     var params = req.params;
      console.log(params.userId)
     GameType
        .find({'players': {userid : params.userId}})
        
        .exec((err, games) => {
          if (err) return next(err);
          if (!games) return next({
            message: 'game not found.',
            status: 404
          });
  
          utils.sendJSONresponse(res, 200, games);
        });
   }

   /**
   * Get games by gameID
   * GET '/games/:gameId'
   */
  function getGameType(req, res, next) {
    var params = req.params;

    GameType
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

  function removeGameType(req, res, next){
    console.log('removing game')
    var params = req.params;
    console.log('removing game',params.gameId)
    GameType
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
  function updateGameType(req, res, next) {
    // console.log(req.body)
    var bodyParams = req.body;
    
    // console.log(currentGameType)

    GameType
      .findOneAndUpdate(
        { _id: ObjectId(bodyParams._id) },
        { '$set': {
          'gametype': bodyParams.gametype,
          'host': bodyParams.host,
          'optionalplayers': bodyParams.optionalplayers,
          'players': bodyParams.players,
          'time': bodyParams.time,
          'timeoptions': bodyParams.timeoptions,
          'updatedat': bodyParams.updatedAt,
          'winner': bodyParams.winner,

         
          }
        },
        { upsert: false, new: true, fields: { password: 0 }, runValidators: true, setDefaultsOnInsert: true })
      .exec((err, game) => {
        if (err) return next({ err: err, status: 400 });
        if (!game) return next({
          message: 'GameType not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 200, game);
      });
  }


  

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
