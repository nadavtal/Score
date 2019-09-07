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
    getClashUserFromDb,
    updateClashUser,
    getUserBattlesFromClashApi,
    
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
   * GET '/users/:usertag'
   */
  function getClashPlayer(req, res){
    var userTag = req.params.usertag;
    addBattlesToClashUser(userTag)
      .then(function(updatedUser){
        console.log('got updatedUser')
        var url = 'https://api.clashroyale.com/v1/players/'+ reparedUserTag
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
            var user = JSON.parse(body);
            console.log('body',user.tag)
            // addBattlesToClashUser(user.tag)  
            
            res.send({updatedUser:updatedUser, clashUser: user})
              
          })
      });
    
    var reparedUserTag = userTagToFriendlyUrl(userTag);
    // var battlesUrl = 'https://api.clashroyale.com/v1/players/'+ reparedUserTag +'/battlelog'
    // console.log('getting clash user battles url', battlesUrl)
    // var options = { method: 'GET',
    //   url: battlesUrl,
    //   headers: 
    //   { 
    //     Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdiODAyNDE4LWQxN2EtNGQ3Ni1iZGQyLTNhMzUzMWJhZTdjYiIsImlhdCI6MTU2MzUzMTM2Nywic3ViIjoiZGV2ZWxvcGVyLzJjOTg4MjcxLTMwYzktZmQ1ZS03YWQyLTQ1Yzg3YTYxZWIwNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIyMTMuNTcuMjQ2LjQ0Il0sInR5cGUiOiJjbGllbnQifV19.eBzA0OArr0ag9xGuDZVkhId5X7m44gIPI67gL5xDRjF4O86lWwn2IPWpLqH54nAvIxeKq4hvC6u29TFyeKpi-A' },
    //     'Cache-Control': 'no-cache' 
    //   };
        
    // request(options, function (error, response, body) {
    //   if (error) throw new Error(error);
    //   var battles = JSON.parse(body);
    //   console.log(battles);
    //   addBattlesToClashUser()
    //   ClashUser
    //   .findOne({ 'userTag': userTag })
    //   .exec((err, clashUser) => {
    //     if (err) return next(err);
    //     if (!clashUser) return next({
    //       message: 'clashUser not found.',
    //       status: 404
    //     });

    //     console.log('clashUser', clashUser)
    //   });
        
    // });
    

      
  }

  function addBattlesToClashUser(userTag){
    var promise = new Promise(function(resolve, reject){
      
      ClashUser
        .findOne({ userTag:  userTag})
        .then(function(clashUser){
          console.log('got clashUser: ');
          var user = clashUser;
          var reparedUserTag = userTagToFriendlyUrl(userTag);
          // console.log(reparedUserTag);
          var url = 'https://api.clashroyale.com/v1/players/'+ reparedUserTag +'/battlelog'
          // console.log('getting clash user battles url', url)
          var options = { method: 'GET',
            url: url,
            headers: 
            { 
              Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdiODAyNDE4LWQxN2EtNGQ3Ni1iZGQyLTNhMzUzMWJhZTdjYiIsImlhdCI6MTU2MzUzMTM2Nywic3ViIjoiZGV2ZWxvcGVyLzJjOTg4MjcxLTMwYzktZmQ1ZS03YWQyLTQ1Yzg3YTYxZWIwNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIyMTMuNTcuMjQ2LjQ0Il0sInR5cGUiOiJjbGllbnQifV19.eBzA0OArr0ag9xGuDZVkhId5X7m44gIPI67gL5xDRjF4O86lWwn2IPWpLqH54nAvIxeKq4hvC6u29TFyeKpi-A' },
              'Cache-Control': 'no-cache' 
            };
              
          request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log('got battles from clash API')
              
            
            var battles = JSON.parse(body);
            // console.log(battles);
            var battlesLeangth = user.battles.length;
            for(let battle of battles){
              var exists = checkIfBattleExists(user, battle.battleTime);
              // console.log(exists);
              if(!exists){
                user.battles.push(battle);
              }
              
            };
            console.log(battlesLeangth, user.battles.length)
            if(battlesLeangth !== user.battles.length){
              updateClashUser(user)
                .then(function(updatedUser){
                  // console.log('updatedUser', updatedUser);
                  resolve(updatedUser)
                });  
            } else{
              console.log('no new battles')
              resolve(user)
            }
          })
          
        })
    })
    
    return(promise)

  }

  function getClashUserFromDb(req, res){
    // console.log('askdjaskjdhakjsddh')
    var usertag = req.params.usertag;
    
    console.log(usertag);
    ClashUser
    .findOne({ 'userTag': usertag })
    .exec((err, group) => {
      if (err) return next(err);
      if (!group) return next({
        message: 'group not found.',
        status: 404
      });

      utils.sendJSONresponse(res, 200, group);
    });

    
  };

  function getUserBattlesFromClashApi(req, res){
    var reparedUserTag = userTagToFriendlyUrl(req.params.usertag);
    console.log(reparedUserTag);
    var url = 'https://api.clashroyale.com/v1/players/'+ reparedUserTag +'/battlelog'
    console.log('getting clash user battles url', url)
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
    });
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
  // updateAllClashUsers();
  function updateAllClashUsers(){
    ClashUser
      .find()
      .then(function(clashUsers){
        // console.log('clashUsers: ', clashUsers);
        for(let user of clashUsers){
          var reparedUserTag = userTagToFriendlyUrl(user.userTag);
          console.log(reparedUserTag);
          var url = 'https://api.clashroyale.com/v1/players/'+ reparedUserTag +'/battlelog'
          console.log('getting clash user battles url', url)
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
              
            
            var battles = JSON.parse(body);
            // console.log(battles);
            var battlesLeangth = user.battles.length;
            for(let battle of battles){
              var exists = checkIfBattleExists(user, battle.battleTime);
              // console.log(exists);
              if(!exists){
                user.battles.push(battle);
              }
              
            };
            console.log(battlesLeangth, user.battles.length)
            if(battlesLeangth !== user.battles.length){
              updateClashUser(user)
                .then(function(updatedUser){
                  console.log(updatedUser)
                });  
            } else{
              console.log('no new battles')

            }
          })
        }
      })

  }
  
  
  

  function checkIfBattleExists(user, battleTime){
    var exists = false
    for(let battle of user.battles){
      if(battle.battleTime == battleTime){
        // console.log('found battle in DB', battleTime);
        exists = true;
        break;
      }
    }
    return exists;
  }

  function userTagToFriendlyUrl(userTag){
    var reparedUserTag = '%23'+ userTag.slice(1, userTag.length)
    return reparedUserTag
  }

  function updateClashUser(user){
    var promise = new Promise(function(resolve, reject){
      console.log('updating clash user: ', user.userTag);
      ClashUser
        .findOneAndUpdate(
          { userTag:  user.userTag},
          { '$set': {
            'battles' : user.battles,
            
            }
          },
          { upsert: false, new: true, runValidators: true, setDefaultsOnInsert: true })
        .exec((err, updatedUser) => {
          // console.log('returneduser', user)
          if (err) return next({ err: err, status: 400 });
          if (!updatedUser) return next({
            message: 'user not found.',
            status: 404
          });
          resolve(updatedUser)
          // console.log('returned user', user)
        });
      
    });
    return promise
  };

  setInterval(function(){
    updateAllClashUsers();
  }, 1500000)


  

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
