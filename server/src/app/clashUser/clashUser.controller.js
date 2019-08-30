;(function() {

  'use strict';

  /**
   * Users endpoint controller
   * @desc Handler functions for all /users routes
   */
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var ClashUser = require('./clashuser.model.js');

  var utils = require('../utils/utils.js');
  var request = require("request");

  // public
  module.exports = {
    isAdmin,
    getClashPlayer,
    createUser,
    getClashUsersFromDatabase,
    getClashPlayerBattles
    
  };

  /// definitions
  
  function createUser(req, res, next) {
    var params = req.body;
    console.log('creating clash user', params)
    var user = new ClashUser({
      userTag: params.userTag,
      
    });
    console.log(user)
    // req params validation for required fields
    req.checkBody('userTag', 'userTag must be defined').notEmpty();
    

    // validate user input
    var errors = req.validationErrors();
    if (errors) {
        utils.sendJSONresponse(res, 400, errors);
        return;
    }

    user.save((err, newUser) => {
      console.log('saving clash user', newUser)
      if (err) return next({ err: err, status: 400 });
      if (!newUser) return next({ message: 'clash User not created.', status: 400 });

      utils.sendJSONresponse(res, 201, newUser);
    });
  }

  /**
   * Get user
   * GET '/users/:userId'
   */
  function getClashPlayer(req, res){
    var usertag = req.params.userId
    // var responseObj = {
    //   user = {},
    //   battles = {}
    // }
    // console.log('getting clash player', usertag)
    var reparedUserId = '%23'+ usertag.slice(1, usertag.length)
    var url = 'https://api.clashroyale.com/v1/players/'+ reparedUserId
    // console.log('getting clash user', url)
    var options = { method: 'GET',
      url: url,
      headers: 
      { 
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdiODAyNDE4LWQxN2EtNGQ3Ni1iZGQyLTNhMzUzMWJhZTdjYiIsImlhdCI6MTU2MzUzMTM2Nywic3ViIjoiZGV2ZWxvcGVyLzJjOTg4MjcxLTMwYzktZmQ1ZS03YWQyLTQ1Yzg3YTYxZWIwNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIyMTMuNTcuMjQ2LjQ0Il0sInR5cGUiOiJjbGllbnQifV19.eBzA0OArr0ag9xGuDZVkhId5X7m44gIPI67gL5xDRjF4O86lWwn2IPWpLqH54nAvIxeKq4hvC6u29TFyeKpi-A' },
        'Cache-Control': 'no-cache' 
      };
        
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        // console.log(body)
          
        
        res.send(body)
          
      })

      
  }

  function getClashPlayerBattles(req, res){
    var usertag = req.params.userId
    // var responseObj = {
    //   user = {},
    //   battles = {}
    // }
    console.log('getting clash player battles', usertag)
    var reparedUserId = '%23'+ usertag.slice(1, usertag.length)
    var url = 'https://api.clashroyale.com/v1/players/'+ reparedUserId +'/battlelog'
    console.log('getting clash user vattlesurl', url)
    var options = { method: 'GET',
      url: url,
      headers: 
      { 
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdiODAyNDE4LWQxN2EtNGQ3Ni1iZGQyLTNhMzUzMWJhZTdjYiIsImlhdCI6MTU2MzUzMTM2Nywic3ViIjoiZGV2ZWxvcGVyLzJjOTg4MjcxLTMwYzktZmQ1ZS03YWQyLTQ1Yzg3YTYxZWIwNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIyMTMuNTcuMjQ2LjQ0Il0sInR5cGUiOiJjbGllbnQifV19.eBzA0OArr0ag9xGuDZVkhId5X7m44gIPI67gL5xDRjF4O86lWwn2IPWpLqH54nAvIxeKq4hvC6u29TFyeKpi-A' },
        'Cache-Control': 'no-cache' 
      };
        
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        // console.log(body)
          
        
        res.send(body)
          
      })

      
  }

  

  function getClashUsersFromDatabase(req, res, next){
    console.log('getting clash users from database')
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;

    var options = {
        offset: 0,
        page: page,
        limit: limit,
        lean: true
    };
    

    ClashUser.paginate({}, options, (err, users) => {
      console.log('paginating')
      if (err) return next(err);
      if (!users) return next({
        message: 'No users found.',
        status: 404
      });

      var pagination = {
        pageNumber: users.page,
        itemsPerPage: users.limit,
        prev: res.locals.paginate.href(true),
        next: res.locals.paginate.href(),
      };

      utils.sendJSONresponse(res, 200, users, false, pagination);
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
