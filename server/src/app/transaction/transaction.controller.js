;(function() {

  'use strict';

  /**
   * transaction endpoint controller
   * @desc Handler functions for all /transaction routes
   */
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var Transaction = require('./transaction.model.js');
  var utils = require('../utils/utils.js');
  var usersCtrl = require('../user/users.controller')
  var User = require('../user/user.model')


  // public
  module.exports = {
    createTransaction,
    getAllTransactions,
    getTransaction,
    updateTransaction,
    removeTransaction,
    getTransactionsByUserId
  };

  /// definitions

   /**
   * Create new transaction
   * POST '/transactions'
   */
  function createTransaction(req, res, next) {
    console.log('creating platfrom')
    var params = req.body;
    // console.log(params)
    var transaction = new Transaction({
      transactionType: params.transactionType,
      transactionMethod: params.transactionMethod,
      userId: params.userId,
      gameId: params.gameId,
      tournamentId: params.tournamentId,
      amount: params.amount,
      agent: params.agent,
      createdAt: Date.now(),
      
    });
    console.log(transaction)
    // req params validation for required fields
    req.checkBody('transactionType', 'transactionType must be defined').notEmpty();
    // req.checkBody('transactionMethod', 'transactionMethod must be defined').notEmpty();
    req.checkBody('userId', 'userId must be defined').notEmpty();
    req.checkBody('amount', 'amount must be defined').notEmpty();
    
    // validate user input
    var errors = req.validationErrors();
    if (errors) {
      console.log('error in creating transaction')
        utils.sendJSONresponse(res, 400, errors);
        
        return;
    }

    transaction.save((err, newTransaction) => {
      console.log('saving transaction', newTransaction)
      if (err) return next({ err: err, status: 400 });
      if (!newTransaction) return next({ message: 'Transaction not created.', status: 400 });
      
      utils.sendJSONresponse(res, 201, newTransaction);
    });
  }

  function updateUser(userId, amount) {
    User
      .findOneAndUpdate(
        { _id: ObjectId(userId) },
        { '$set': {
          'balance' : bodyParams.userName,
          
          }
        },
        { upsert: false, new: true, fields: { password: 0 }, runValidators: true, setDefaultsOnInsert: true })
      .exec((err, user) => {
        console.log('returnedUser', user)
        if (err) return next({ err: err, status: 400 });
        if (!user) return next({
          message: 'User not found.',
          status: 404
        });

        utils.sendJSONresponse(200, user);
      });
  }

  /**
   * Get transactions (paginated)
   * GET '/transactions/'
   */
  function getAllTransactions(req, res, next) {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;


    // Transaction.find({}, function (err, transactions) {
    //   res.send(transactions);
    // });

    var options = {
        page: page,
        limit: limit,
        lean: true
    };



    Transaction.paginate({}, options, (err, transactions) => {
      // console.log(transactions)
      if (err) return next(err);
      if (!transactions) return next({
        message: 'No transactions found.',
        status: 404
      });

      var pagination = {
        pageNumber: transactions.page,
        itemsPerPage: transactions.limit,
        prev: res.locals.paginate.href(true),
        next: res.locals.paginate.href(),
      };

      utils.sendJSONresponse(res, 200, transactions, false, pagination);
    });
  }

  /**
   * Get transactions by user
   * GET '/transactions/:userId'
   */

   function getTransactionsByUserId(req, res, next){
     var params = req.params;
      console.log(params.userId)
     Transaction
        .find({userId : params.userId})
        
        .exec((err, transactions) => {
          if (err) return next(err);
          if (!transactions) return next({
            message: 'transaction not found.',
            status: 404
          });
  
          utils.sendJSONresponse(res, 200, transactions);
        });
   }

   /**
   * Get transactions by transactionID
   * GET '/transactions/:transactionId'
   */
  function getTransaction(req, res, next) {
    var params = req.params;

    Transaction
      .findOne({ '_id': ObjectId(params.transactionId) })
      .exec((err, transaction) => {
        if (err) return next(err);
        if (!transaction) return next({
          message: 'transaction not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 200, transaction);
      });
  }

  function removeTransaction(req, res, next){
    console.log('removing transaction')
    var params = req.params;
    console.log('removing transaction',params.transactionId)
    Transaction
      .update({ _id: params._id }, { "$pull": { "_id": params._id } }, { safe: true, multi:true }, function(err, obj) {
      //do something smart
      console.log(obj)
      if (err) return next(err);
      if (!transaction) return next({
        message: 'transaction not found.',
        status: 404
      });

      utils.sendJSONresponse(res, 200, transaction);
  });
    
  }

  /**
   * Update transaction
   * PUT '/transactions/:userId'
   */
  function updateTransaction(req, res, next) {
    // console.log(req.body)
    var bodyParams = req.body;
    
    // console.log(currentTransaction)

    Transaction
      .findOneAndUpdate(
        { _id: ObjectId(bodyParams._id) },
        { '$set': {
          'transactiontype': bodyParams.transactiontype,
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
      .exec((err, transaction) => {
        if (err) return next({ err: err, status: 400 });
        if (!transaction) return next({
          message: 'Transaction not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 200, transaction);
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
