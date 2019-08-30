;(function() {

  'use strict';

  /**
   * game endpoint controller
   * @desc Handler functions for all /game routes
   */
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var PlatformType = require('./platformtype.model.js');

  var utils = require('../utils/utils.js');


  // public
  module.exports = {
    createPlatformType,
    getAllPlatformTypes,
    getPlatformType,
    updatePlatformType,
    removePlatformType,
    getPlatformTypesByUserId
  };

  /// definitions

   /**
   * Create new game
   * POST '/games'
   */
  function createPlatformType(req, res, next) {
    console.log('creating platformType')
    var params = req.body;
    console.log(params)
    var platformType = new PlatformType({
      name: params.name,
      
      
    });
    console.log(platformType)
    // req params validation for required fields
    req.checkBody('name', 'name must be defined').notEmpty();
    
    // validate user input
    var errors = req.validationErrors();
    if (errors) {
      console.log('error creating platformType')
        utils.sendJSONresponse(res, 400, errors);
        return;
    }

    platformType.save((err, newPlatformType) => {
      console.log('saving platformType', newPlatformType)
      if (err) return next({ err: err, status: 400 });
      if (!newPlatformType) return next({ message: 'PlatformType not created.', status: 400 });

      utils.sendJSONresponse(res, 201, newPlatformType);
    });
  }

  /**
   * Get games (paginated)
   * GET '/games/'
   */
  function getAllPlatformTypes(req, res, next) {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;


    // PlatformType.find({}, function (err, games) {
    //   res.send(games);
    // });

    var options = {
        page: 1,
        limit: 100,
        lean: true
    };



    PlatformType.paginate({}, options, (err, games) => {
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

   function getPlatformTypesByUserId(req, res, next){
     var params = req.params;
      console.log(params.userId)
     PlatformType
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
  function getPlatformType(req, res, next) {
    var params = req.params;

    PlatformType
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

  function removePlatformType(req, res, next){
    console.log('removing game')
    var params = req.params;
    console.log('removing game',params.gameId)
    PlatformType
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
  function updatePlatformType(req, res, next) {
    // console.log(req.body)
    var bodyParams = req.body;
    
    // console.log(currentPlatformType)

    PlatformType
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
          message: 'PlatformType not found.',
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
