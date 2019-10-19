;(function() {

  'use strict';

  /**
   * game endpoint controller
   * @desc Handler functions for all /game routes
   */
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var Platform = require('./platform.model.js');

  var bcrypt = require('bcryptjs');
  var SALT_WORK_FACTOR = 10;
  var jwt = require('jsonwebtoken');
  var config = require('../../config/config.js');
  var utils = require('../utils/utils.js');


  // public
  module.exports = {
    createPlatform,
    getAllPlatforms,
    getPlatform,
    updatePlatform,
    removePlatform,
    getPlatformsByUserId
  };

  /// definitions

   /**
   * Create new game
   * POST '/games'
   */
  function createPlatform(req, res, next) {
    console.log('creating platfrom')
    var params = req.body;
    // console.log(params)
    var platform = new Platform({
      name: params.name,
      type: params.type
      
    });
    console.log(platform)
    // req params validation for required fields
    req.checkBody('name', 'name must be defined').notEmpty();
    
    // validate user input
    var errors = req.validationErrors();
    if (errors) {
      console.log('error in creating platform')
        utils.sendJSONresponse(res, 400, errors);
        return;
    }

    platform.save((err, newPlatform) => {
      console.log('saving platform', newPlatform)
      if (err) return next({ err: err, status: 400 });
      if (!newPlatform) return next({ message: 'Platform not created.', status: 400 });

      utils.sendJSONresponse(res, 201, newPlatform);
    });
  }

  /**
   * Get games (paginated)
   * GET '/games/'
   */
  function getAllPlatforms(req, res, next) {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;


    // Platform.find({}, function (err, games) {
    //   res.send(games);
    // });

    var options = {
        page: page,
        limit: limit,
        lean: true
    };



    Platform.paginate({}, options, (err, games) => {
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

   function getPlatformsByUserId(req, res, next){
     var params = req.params;
      console.log(params.userId)
     Platform
        .find({'players': {userId : params.userId}})
        
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
  function getPlatform(req, res, next) {
    var params = req.params;

    Platform
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

  function removePlatform(req, res, next){
    console.log('removing game')
    var params = req.params;
    console.log('removing game',params.gameId)
    Platform
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
  function updatePlatform(req, res, next) {
    // console.log(req.body)
    var bodyParams = req.body;
    
    // console.log(currentPlatform)

    Platform
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
          message: 'Platform not found.',
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
