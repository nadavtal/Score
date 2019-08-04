;(function() {

  'use strict';

  /**
   * game endpoint controller
   * @desc Handler functions for all /game routes
   */
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var Game = require('./game.model.js');

  var bcrypt = require('bcryptjs');
  var SALT_WORK_FACTOR = 10;
  var jwt = require('jsonwebtoken');
  var config = require('../../config/config.js');
  var utils = require('../utils/utils.js');


  // public
  module.exports = {
    createGame,
    getAllGames,
    getGame,
    updateGame,
    removeGame,
    getGamesByUserId,
    getGamesByGroupId
  };

  /// definitions

   /**
   * Create new game
   * POST '/games'
   */
  function createGame(req, res, next) {
    
    var params = req.body;
    console.log('creating game with params:', params)
    var game = new Game({
      name: params.name,
      gameType: params.gameType,
      platformType : params.platformType,
      host: params.host,
      time: params.time,
      group: params.group,
      players : params.players,
      optionalPlayers : params.optionalPlayers,
      
    });
    console.log('game before saving:', game)
    // req params validation for required fields
    req.checkBody('gameType', 'gameType must be defined').notEmpty();
    req.checkBody('platformType', 'platformType must be defined').notEmpty();
    req.checkBody('host', 'host must be defined').notEmpty();

    // validate user input
    var errors = req.validationErrors();
    if (errors) {
      console.log('errorserrorserrors')
        utils.sendJSONresponse(res, 400, errors);
        return;
    }

    game.save((err, newGame) => {
      console.log('saved game', newGame)
      if (err) return next({ err: err, status: 400 });
      if (!newGame) return next({ message: 'Game not created.', status: 400 });

      utils.sendJSONresponse(res, 201, newGame);
    });
  }

  /**
   * Get games (paginated)
   * GET '/games/'
   */
  function getAllGames(req, res, next) {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;


    // Game.find({}, function (err, games) {
    //   res.send(games);
    // });

    var options = {
        page: page,
        limit: limit,
        lean: true
    };



    Game.paginate({}, options, (err, games) => {
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
  function getUser(req, res, next) {
    var params = req.params;

    User
      .findOne({ '_id': ObjectId(params.userId) }, { password: 0, __v: 0 })
      .exec((err, user) => {
        if (err) return next(err);
        if (!user) return next({
          message: 'User not found.',
          status: 404
        });
        // console.log(res)
        utils.sendJSONresponse(res, 200, user);
      });
  }

  function getGamesByUserId(req,res,next){
    console.log('getting games by userId:', req.params.userId);
    
    var params = req.params;
    Game.find({ 'players.userId': params.userId }, { 'players.$': 1 })
    .exec((err, data) => {
      // console.log(data)
      if (err) return next(err);
      if (!data) return next({
        message: 'groups not found.',
        status: 404
      });
      var gamesIds = []
      for (var i = 0; i < data.length; i++){
        console.log(data[i]);
        gamesIds.push(data[i]._id);
        
      }
      console.log('IDS', gamesIds);
      
      
    })
    .then((gamesIds)=> {
      Game.find({'_id': { $in: gamesIds }})
      .exec((err, data) => {
        if (err) return next(err);
        if (!data) return next({
          message: 'groups not found.',
          status: 404
        });
        utils.sendJSONresponse(res, 200, data);
      
      });
    })
  }

  function getGamesByGroupId(req,res,next){
    console.log(req.params);
    var params = req.params;
    Game.find({ 'group': params.groupId })
    .exec((err, data) => {
      if (err) return next(err);
      if (!data) return next({
        message: 'groups not found.',
        status: 404
      });
      var gamesIds = []
      for (var i = 0; i < data.length; i++){
        console.log(data[i]);
        gamesIds.push(data[i]._id);
        
      }
      console.log('IDS', gamesIds);
      
      
    })
    .then((gamesIds)=> {
      Game.find({'_id': { $in: gamesIds }})
      .exec((err, data) => {
        if (err) return next(err);
        if (!data) return next({
          message: 'groups not found.',
          status: 404
        });
        utils.sendJSONresponse(res, 200, data);
      
      });
    })
  }

   /**
   * Get games by gameID
   * GET '/games/:gameId'
   */
  function getGame(req, res, next) {
    var params = req.params;

    Game
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

  function removeGame(req, res, next){
    console.log('removing game')
    var params = req.params;
    console.log('removing game',params.gameId)
    Game
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
  function updateGame(req, res, next) {
    // console.log(req.body)
    var bodyParams = req.body;
    
    console.log(bodyParams)

    Game
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
          message: 'Game not found.',
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
