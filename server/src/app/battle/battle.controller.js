;(function() {

  'use strict';

  /**
   * battle endpoint controller
   * @desc Handler functions for all /battle routes
   */
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var Battle = require('./battle.model.js');

  var bcrypt = require('bcryptjs');
  var SALT_WORK_FACTOR = 10;
  var jwt = require('jsonwebtoken');
  var config = require('../../config/config.js');
  var utils = require('../utils/utils.js');


  // public
  module.exports = {
    createBattle,
    getAllBattles,
    getBattle,
    updateBattle,
    removeBattle,
    getBattlesByUserId
  };

  /// definitions

   /**
   * Create new battle
   * POST '/battles'
   */
  function createBattle(req, res, next) {
    console.log('creating battle')
    var params = req.body;
    // console.log(params)
    var battle = new Battle({
      battletype: params.battletype,
      host: params.host,
      time: params.time
      
    });
    console.log(battle)
    // req params validation for required fields
    req.checkBody('battletype', 'battletype must be defined').notEmpty();
    req.checkBody('host', 'host must be defined').notEmpty();

    // validate user input
    var errors = req.validationErrors();
    if (errors) {
      console.log('error in creting battle')
        utils.sendJSONresponse(res, 400, errors);
        return;
    }

    battle.save((err, newBattle) => {
      console.log('saving battle', newBattle)
      if (err) return next({ err: err, status: 400 });
      if (!newBattle) return next({ message: 'Battle not created.', status: 400 });

      utils.sendJSONresponse(res, 201, newBattle);
    });
  }

  /**
   * Get battles (paginated)
   * GET '/battles/'
   */
  function getAllBattles(req, res, next) {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;


    // Battle.find({}, function (err, battles) {
    //   res.send(battles);
    // });

    var options = {
        page: page,
        limit: limit,
        lean: true
    };



    Battle.paginate({}, options, (err, battles) => {
      // console.log(battles)
      if (err) return next(err);
      if (!battles) return next({
        message: 'No battles found.',
        status: 404
      });

      var pagination = {
        pageNumber: battles.page,
        itemsPerPage: battles.limit,
        prev: res.locals.paginate.href(true),
        next: res.locals.paginate.href(),
      };

      utils.sendJSONresponse(res, 200, battles, false, pagination);
    });
  }

  /**
   * Get battles by user
   * GET '/battles/:userId'
   */

   function getBattlesByUserId(req, res, next){
     var params = req.params;
      console.log(params.userId)
     Battle
        .find({'players': {userid : params.userId}})
        
        .exec((err, battles) => {
          if (err) return next(err);
          if (!battles) return next({
            message: 'battle not found.',
            status: 404
          });
  
          utils.sendJSONresponse(res, 200, battles);
        });
   }

   /**
   * Get battles by battleID
   * GET '/battles/:battleId'
   */
  function getBattle(req, res, next) {
    var params = req.params;

    Battle
      .findOne({ '_id': ObjectId(params.battleId) }, { password: 0, __v: 0 })
      .exec((err, battle) => {
        if (err) return next(err);
        if (!battle) return next({
          message: 'battle not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 200, battle);
      });
  }

  function removeBattle(req, res, next){
    console.log('removing battle')
    var params = req.params;
    console.log('removing battle',params.battleId)
    Battle
      .update({ _id: params.battleId }, { "$pull": { "battleId": params.battleId } }, { safe: true, multi:true }, function(err, obj) {
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
   * Update battle
   * PUT '/battles/:userId'
   */
  function updateBattle(req, res, next) {
    // console.log(req.body)
    var bodyParams = req.body;
    
    // console.log(currentBattle)

    Battle
      .findOneAndUpdate(
        { _id: ObjectId(bodyParams._id) },
        { '$set': {
          'battletype': bodyParams.battletype,
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
      .exec((err, battle) => {
        if (err) return next({ err: err, status: 400 });
        if (!battle) return next({
          message: 'Battle not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 200, battle);
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
