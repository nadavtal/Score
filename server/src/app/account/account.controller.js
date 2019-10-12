;(function() {

  'use strict';

  /**
   * game endpoint controller
   * @desc Handler functions for all /game routes
   */
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var Account = require('./account.model.js');

  var bcrypt = require('bcryptjs');
  var SALT_WORK_FACTOR = 10;
  var jwt = require('jsonwebtoken');
  var config = require('../../config/config.js');
  var utils = require('../utils/utils.js');


  // public
  module.exports = {
    createAccount,
    getAllAccounts,
    getAccount,
    updateAccount,
    removeAccount,
    getAccountsByUserId,
    getAccountsByUserName,
    getAccountsByPlatformName
  };

  /// definitions

   /**
   * Create new game
   * POST '/games'
   */
  function createAccount(req, res, next) {
    console.log('creating account  ')
    var params = req.body;
    // console.log(params)
    var account = new Account({
      platform: params.platform,
      accountType: params.accountType,
      userName: params.userName,
      accountId: params.accountId,
      userId: params.userId
      
    });
    console.log(account)
    // req params validation for required fields
    req.checkBody('userName', 'userName must be defined').notEmpty();
    
    // validate user input
    var errors = req.validationErrors();
    if (errors) {
      
        utils.sendJSONresponse(res, 400, errors);
        return;
    }

    account.save((err, newAccount) => {
      console.log('saving account', newAccount)
      if (err) return next({ err: err, status: 400 });
      if (!newAccount) return next({ message: 'Account not created.', status: 400 });

      utils.sendJSONresponse(res, 201, newAccount);
    });
  }

  /**
   * Get games (paginated)
   * GET '/games/'
   */
  function getAllAccounts(req, res, next) {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;


    // Account.find({}, function (err, games) {
    //   res.send(games);
    // });

    var options = {
        page: page,
        limit: limit,
        lean: true
    };



    Account.paginate({}, options, (err, games) => {
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
   * Get account by user
   * GET '/account/:userId'
   */

   function getAccountsByUserId(req, res, next){
     var params = req.params;
      console.log(params.userId)
     Account
        .find( {userId : params.userId})
        
        .exec((err, accounts) => {
          if (err) return next(err);
          if (!accounts) return next({
            message: 'game not found.',
            status: 404
          });
  
          utils.sendJSONresponse(res, 200, accounts);
        });
   }

   function getAccountsByUserName(req, res, next){
    var params = req.params;
     console.log(params.userName)
    Account
       .find( {userName : params.userName})
       
       .exec((err, accounts) => {
         if (err) return next(err);
         if (!accounts) return next({
           message: 'game not found.',
           status: 404
         });
 
         utils.sendJSONresponse(res, 200, accounts);
       });
  }

   /**
   * Get account by platform name
   * GET '/account/platforms/:name'
   */

   function getAccountsByPlatformName(req, res, next){
    var params = req.params;
     console.log('getAccountsByPlatformName', params.name)
    Account
       .find( {platform : params.name})
       
       .exec((err, accounts) => {
         if (err) return next(err);
         if (!accounts) return next({
           message: 'game not found.',
           status: 404
         });
 
         utils.sendJSONresponse(res, 200, accounts);
       });
  }

   /**
   * Get accounts by gameID
   * GET '/accounts/:gameId'
   */
  function getAccount(req, res, next) {
    var params = req.params;
    console.log(params)
    Account
      .findOne({ '_id': ObjectId(params.accountId) })
      .exec((err, game) => {
        if (err) return next(err);
        if (!game) return next({
          message: 'account not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 200, game);
      });
  }

  function removeAccount(req, res, next){
    console.log('removing game')
    var params = req.params;
    console.log('removing game',params._id)
    Account
      .update({ _id: params._id }, { "$pull": { "_id": params._id } }, { safe: true, multi:true }, function(err, obj) {
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
  function updateAccount(req, res, next) {
    // console.log(req.body)
    var bodyParams = req.body;
    
    // console.log(currentAccount)

    Account
      .findOneAndUpdate(
        { _id: ObjectId(bodyParams._id) },
        { '$set': {
          'platform': bodyParams.platform,
          'accountType': bodyParams.accountType,
          'accountId': bodyParams.accountId,
          'active': bodyParams.active,
          'inActiveReason': bodyParams.inActiveReason,
          
          }
        },
        { upsert: false, new: true, fields: { password: 0 }, runValidators: true, setDefaultsOnInsert: true })
      .exec((err, account) => {
        if (err) return next({ err: err, status: 400 });
        if (!account) return next({
          message: 'Account not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 200, account);
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
