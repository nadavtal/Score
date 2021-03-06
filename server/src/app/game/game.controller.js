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
      platform : params.platform,
      buyIn: params.buyIn,
      players : params.players,
      playersPerGroup : params.playersPerGroup,
      optionalPlayers : params.optionalPlayers,
      winner: params.winner,
      time: params.time,
      timeOptions: params.timeOptions,
      host: params.host,
      privacy: params.privacy,
      maxPlayers: params.maxPlayers,
      gameGroups: params.gameGroups,
      group: params.group,
      gameGroups : params.gameGroups,
      
    });
    console.log('game before saving:', game)
    // req params validation for required fields
    // req.checkBody('gameType', 'gameType must be defined').notEmpty();
    req.checkBody('platform', 'platform must be defined').notEmpty();
    // req.checkBody('host', 'host must be defined').notEmpty();

    // validate user input
    var errors = req.validationErrors();
    if (errors) {
      console.log('error creating game')
      utils.sendJSONresponse(res, 400, errors);
      return;
    } else{
      game.save((err, newGame) => {
        console.log('saved game', newGame)
        if (err) return next({ err: err, status: 400 });
        if (!newGame) return next({ message: 'Game not created.', status: 400 });
  
        utils.sendJSONresponse(res, 201, newGame);
      });
    }

    
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
    // console.log('getting games by userId:', req.params.userId);
    
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
        // console.log(data[i]);
        gamesIds.push(data[i]._id);
        
      }
      // console.log('IDS', gamesIds);
      
      
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
    Game.find({ 'group.groupId': params.groupId })
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
    // console.log('removing game')
    var params = req.params;
    console.log('removing game',params.gameId)
    Game
      .deleteOne({ _id: params.gameId }, function(err, game) {
      //do something smart
      console.log(game)
      if (err) return next(err);
      if (!game) return next({
        message: 'game not found.',
        status: 404
      });

      utils.sendJSONresponse(res, 200, game);
  });
    
  }

  /**
   * Update game
   * PUT '/games/:userId'
   */
  function updateGame(req, res, next) {
    console.log('updating game: ', req.body)
    var bodyParams = req.body;
    
    console.log('bodyParams', bodyParams)

    Game
      .findOneAndUpdate(
        { _id: ObjectId(bodyParams._id) },
        { '$set': {
          'name': bodyParams.name,
          'gameType': bodyParams.gameType,
          'host': bodyParams.host,
          'optionalPlayers': bodyParams.optionalPlayers,
          'players': bodyParams.players,
          'time': bodyParams.time,
          'timeOptions': bodyParams.timeOptions,
          'privacy': bodyParams.privacy,
          'maxPlayers': bodyParams.maxPlayers,
          'platform': bodyParams.platform,
          'updatedAt': bodyParams.updatedAt,
          'winner': bodyParams.winner,
          'buyIn': bodyParams.buyIn,
          'playersPerGroup': bodyParams.playersPerGroup,
          'gameGroups': bodyParams.gameGroups

         
          }
        },
        { upsert: false, new: true, fields: { password: 0 }, runValidators: true, setDefaultsOnInsert: true })
      .exec((err, game) => {
        console.log('updated game: ', game)
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
