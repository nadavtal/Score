;(function() {

  'use strict';

  /**
   * Users endpoint controller
   * @desc Handler functions for all /users routes
   */
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var Clan = require('./clan.model.js');
  // var ClashUser = require('../clashuser/clashuser.model.js');
  var utils = require('../utils/utils.js');
  var request = require("request");
  var Battle = require('../battle/battle.model');
  
  module.exports = {
    createClan,
    getClansFromDatabase,
    getClashRoyalClanFromClashApi,
    getAllBattlesByClan,
    createFriendlyBattle, 
    getAllFriendlyBattles, 
    getBattle,
    updateClan,
    getClashRoyalClanFromDb,
    getClashRoyalClan
    
  };

  
  
  function createClan(req, res, next) {
    var params = req.body;
    console.log('creating clan', params)

    var clan = new Clan({
      Name: params.clanTag,
      
      // members: params.members
      
    });
    console.log(clan)
    // req params validation for required fields
    req.checkBody('clanTag', 'clanTag must be defined').notEmpty();
    

    // validate user input
    var errors = req.validationErrors();
    if (errors) {
        utils.sendJSONresponse(res, 400, errors);
        return;
    }

    clan.save((err, newClan) => {
      console.log('saving Clan', newClan)
      if (err) return next({ err: err, status: 400 });
      if (!newClan) return next({ message: 'Clan not created.', status: 400 });

      utils.sendJSONresponse(res, 201, newClan);
    });
  }

  function updateClan(clan){
    console.log('clan before update', clan)
    Clan
      .findOneAndUpdate(
        { _id: ObjectId(clan._id) },
        { '$set': {
          'Name': clan.Name,
          'battles': clan.battles,
          'active': clan.active,
          'lastActiveDate': clan.lastActiveDate,
          'inActiveReason': clan.inActiveReason,
          
          }
        },
        { upsert: false, new: true, fields: { password: 0 }, runValidators: true, setDefaultsOnInsert: true })
      .exec((err, updatedlan) => {
        if (err) return next({ err: err, status: 400 });
        if (!updatedlan) return next({
          message: 'Account not found.',
          status: 404
        });

        console.log('Clan updated', updatedlan);
      });
  }  

  function getClashRoyalClan(req, res, next){
    var params = req.params;
    var clanId = params.clanId
    Clan
      .findOne({ 'Name': clanId})
      .then(clanFromDb => {
        console.log(clanFromDb)
        var reparedClanId = '%23'+ clanId.slice(1, clanId.length);
        var url = 'https://api.clashroyale.com/v1/clans/'+ reparedClanId
        console.log('getting clash clan', reparedClanId, url)
        var options = { method: 'GET',
          url: url,
          headers: 
          { 
            Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdiODAyNDE4LWQxN2EtNGQ3Ni1iZGQyLTNhMzUzMWJhZTdjYiIsImlhdCI6MTU2MzUzMTM2Nywic3ViIjoiZGV2ZWxvcGVyLzJjOTg4MjcxLTMwYzktZmQ1ZS03YWQyLTQ1Yzg3YTYxZWIwNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIyMTMuNTcuMjQ2LjQ0Il0sInR5cGUiOiJjbGllbnQifV19.eBzA0OArr0ag9xGuDZVkhId5X7m44gIPI67gL5xDRjF4O86lWwn2IPWpLqH54nAvIxeKq4hvC6u29TFyeKpi-A' } };
        
          request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body)
              
            utils.sendJSONresponse(res, 200, {clanFromDb: clanFromDb,
                                              clanFromClashApi: JSON.parse(body)});
           
              
          })
      })

   
    
    
  }

  function getClashRoyalClanFromDb(clanId) {
    
    Clan
      .findOne({ 'Name': clanId})
      .exec((err, clan) => {
        if (err) return next(err);
        if (!clan) return next({
          message: 'clan not found.',
          status: 404
        });
        console.log(clan)
        return clan
        // utils.sendJSONresponse(res, 200, clan);
      });
  }

  function getClansFromDatabase(req, res, next){
    console.log('getting clans from database')
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;

    var options = {
        offset: 0,
        page: page,
        limit: limit,
        lean: true
    };
    

    Clan.paginate({}, options, (err, clans) => {
      console.log('paginating')
      if (err) return next(err);
      if (!clans) return next({
        message: 'No clans found.',
        status: 404
      });

      var pagination = {
        pageNumber: clans.page,
        itemsPerPage: clans.limit,
        prev: res.locals.paginate.href(true),
        next: res.locals.paginate.href(),
      };

      utils.sendJSONresponse(res, 200, clans, false, pagination);
    });
  }

  function getClashRoyalClanFromClashApi(clanId){
    
    var reparedClanId = '%23'+ clanId.slice(1, clanId.length);
    var url = 'https://api.clashroyale.com/v1/clans/'+ reparedClanId
    console.log('getting clash clan', reparedClanId, url)
    var options = { method: 'GET',
      url: url,
      headers: 
      { 
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdiODAyNDE4LWQxN2EtNGQ3Ni1iZGQyLTNhMzUzMWJhZTdjYiIsImlhdCI6MTU2MzUzMTM2Nywic3ViIjoiZGV2ZWxvcGVyLzJjOTg4MjcxLTMwYzktZmQ1ZS03YWQyLTQ1Yzg3YTYxZWIwNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIyMTMuNTcuMjQ2LjQ0Il0sInR5cGUiOiJjbGllbnQifV19.eBzA0OArr0ag9xGuDZVkhId5X7m44gIPI67gL5xDRjF4O86lWwn2IPWpLqH54nAvIxeKq4hvC6u29TFyeKpi-A' } };
    
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        // console.log(body)
          
        
        return body
          
      })
  }

 

  function createFriendlyBattle(req, res, next){
    
    var params = req.body;
    console.log(params.team.length)
    if(params.team.length == 1){
     
      console.log('creating friendly battle')
      var battle = new Battle({
        type: params.type,
        battleTime: params.battleTime,
        gameMode: params.gameMode.name,
        clan: params.team[0].clan.tag,
        team: [{
              tag: params.team[0].tag,
              name: params.team[0].name,
              crowns: params.team[0].crowns,
              }], 
              
        opponent: [{
              tag: params.opponent[0].tag,
              name: params.opponent[0].name,
              crowns: params.opponent[0].crowns,
              }], 
                  
        
      });
      // console.log(battle)
      // req params validation for required fields
      // req.checkBody('clanTag', 'clanTag must be defined').notEmpty();
      
  
      // validate user input
      var errors = req.validationErrors();
      if (errors) {
          utils.sendJSONresponse(res, 400, errors);
          return;
      }
  
      battle.save((err, newBattle) => {
        console.log('saving Battle', newBattle)
        if (err) return next({ err: err, status: 400 });
        if (!newBattle) return next({ message: 'Battle not created.', status: 400 });
  
        utils.sendJSONresponse(res, 201, newBattle);
      });
    }
    
  }

  function getAllFriendlyBattles(req, res, next){

    console.log('getting battles from database')
    // var page = req.query.page || 1;
    // var limit = req.query.limit || 30;
    // console.log(page, limit)
    var options = {
        offset: 0,
        page: 1,
        limit: 100,
        lean: true
    };
    

    Battle.paginate({}, options, (err, battles) => {
      console.log('paginating battles')
      if (err) return next(err);
      if (!battles) return next({
        message: 'No battles found.',
        status: 404
      });

      var pagination = {
        pageNumber: options.page,
        itemsPerPage: options.limit,
        prev: res.locals.paginate.href(true),
        next: res.locals.paginate.href(),
      };

      utils.sendJSONresponse(res, 200, battles, false, pagination);
    });
  }

  function getBattle(req, res, next){
    var params = req.params
    Battle
      .find({
        battleTime: params.battleTime,
        clan: params.clanTag
        
      })
      .exec(function(err, battle){
        res.send(battle)
      })
  }

  

  

  function findFriendlyBattles(battlesArray){
    var promise = new Promise((resolve, reject)=> {
      var friendlyBattles = []
      if(battlesArray.length == 0){
        reject('No battles in battlesArray')
      }
      for (var j = 0; j < battlesArray.length; j++) {
        // console.log(battlesArray[j])                 
        if(battlesArray[j].type == 'clanMate'){
          
          // console.log('NEW CLAN BATTLE', battlesArray[j]) 
          friendlyBattles.push(battlesArray[j])
  
        }
      }
      resolve(friendlyBattles)
      
      
    })
    return promise
    
  }

 

  function checkIfBattleExists(battle){
    var promise = new Promise((resolve, reject)=> {
      var battletoUpaload = battle
      getFriendlyBattleByTime(battle.battleTime)
      .then((battle)=> {
        // console.log(battle)
        if(battle){
          // console.log('inDB')
          resolve(false)
        } else{
          resolve(battletoUpaload)
        }
      })
    })
    
    return promise  
  }

  function userTagToFriendlyUrl(userTag){
    var reparedUserTag = '%23'+ userTag.slice(1, userTag.length)
    return reparedUserTag
  }

  function getFriendlyBattleByTime(time){
    return Battle
      .findOne({
        battleTime: time
        
      })
      .exec(function(err, battle){
        
      })
  }

  function getAllBattlesByClan(clan){
    var clan = JSON.parse(clan)
    // console.log('CLAN', clan)
    var promiseArr = [];
    if (clan && clan.memberList.length > 0){
      
      for (var i = 0; i < clan.memberList.length; i++) {
          var promise = new Promise(function(resolve, reject) {
            // console.log(clan.memberList[i].tag)
            var reparedUserTag = userTagToFriendlyUrl(clan.memberList[i].tag);
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
              // console.log('got battles from clash API')
                
              
              var battles = JSON.parse(body);
              resolve(battles)
              // console.log(battles);
              // var battlesLeangth = user.battles.length;
              // for(let battle of battles){
              //   var exists = checkIfBattleExists(user, battle.battleTime);
              //   // console.log(exists);
              //   if(!exists){
              //     user.battles.push(battle);
              //   }
                
              // };
              // console.log(battlesLeangth, user.battles.length)
              // if(battlesLeangth !== user.battles.length){
              //   updateClashUser(user)
              //     .then(function(updatedUser){
              //       // console.log('updatedUser', updatedUser);
              //       resolve(updatedUser)
              //     });  
              // } else{
              //   console.log('no new battles')
              //   resolve(user)
              // }
              })
              
            })
              
          
          promiseArr.push(promise);
      }
      
      return Promise.all(promiseArr);

    } else {
      return
    }
  }

  function getClanBattles(clanId) {
    var promise = new Promise(function(resolve, reject){
      var reparedClanId = '%23'+ clanId.slice(1, clanId.length);
      var url = 'https://api.clashroyale.com/v1/clans/'+ reparedClanId
      // console.log('getting clash clan', reparedClanId, url)
      var options = { method: 'GET',
        url: url,
        headers: 
        { 
          Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdiODAyNDE4LWQxN2EtNGQ3Ni1iZGQyLTNhMzUzMWJhZTdjYiIsImlhdCI6MTU2MzUzMTM2Nywic3ViIjoiZGV2ZWxvcGVyLzJjOTg4MjcxLTMwYzktZmQ1ZS03YWQyLTQ1Yzg3YTYxZWIwNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIyMTMuNTcuMjQ2LjQ0Il0sInR5cGUiOiJjbGllbnQifV19.eBzA0OArr0ag9xGuDZVkhId5X7m44gIPI67gL5xDRjF4O86lWwn2IPWpLqH54nAvIxeKq4hvC6u29TFyeKpi-A' } };
      
        request(options, function (error, response, clan) {
          if (error){
            reject(error)
            // throw new Error(error);
          } else{
            getAllBattlesByClan(clan)
            .then(function(battles) {
                  // console.log(values);
                  resolve(battles)
              });
          }
          // console.log(clan)
          
            
        })
      
    });
    return promise
      
  };

  function getFriendlyBattlesByClan(clanId){
    var promise = new Promise((resolve, reject) =>{
      var friendlyBattles = []
      getClanBattles(clanId)
      .then(function(battles){
        // console.log('BATTLES', battles.length);
        
        for(var i = 0; i<battles.length; i++){
          findFriendlyBattles(battles[i])
          .then((battles)=>{
            for(var j = 0; j<battles.length; j++){
              friendlyBattles.push(battles[j])
            }
            resolve(friendlyBattles)
          },
          function(err) {
            console.log(err)
          })
        }
        
      },
      function(err) {
        console.log(err)
      });
    })
    return promise
  }

  function getNewFriendlyBattlesByClan(clan){
    var promise = new Promise((resolve, reject) => {
      var newBattles = []
      getFriendlyBattlesByClan(clan.Name)
      .then((friendlyBattles) => {
        var promiseArray = []
        for(var i = 0; i<friendlyBattles.length; i++){
          var promise = new Promise((resolve, reject) => {
            checkIfBattleExists(friendlyBattles[i])
            .then((battle)=>{
              // console.log(battle)
              if(battle){
                newBattles.push(battle);
                resolve(battle)
                // console.log('New Battle')
              } else{
                resolve('battle exists in DB')
                // console.log('battle exists in DB')
              }
            },
            function(err) {
              console.log(err)
            })
          })
          promiseArray.push(promise)
        }
        Promise.all(promiseArray)
          .then(data => {
            // console.log(data);
            // console.log('NEW BATTLESSSSSSSSS', newBattles);
            if(newBattles.length == 0){
              resolve(false)
            } else{
              console.log('NEW BATTLES')
              resolve(newBattles)
            }
          })
        
      },
      function(err) {
        console.log(err)
      })
      
    });
    return promise
  }

  function saveBattles(battles) {
    console.log('BATTLES IN SAVE BATTLES()', battles)
    for(var i = 0; i<battles.length; i++){
      let battle = battles[i];
      var newBattle = new Battle({
        type: battle.type,
        battleTime: battle.battleTime,
        gameMode: battle.gameMode.name,
        clan: battle.opponent[0].clan ? battle.opponent[0].clan.tag : battle.team[0].clan.tag,
        team: [{
              tag: battle.team[0].tag,
              name: battle.team[0].name,
              crowns: battle.team[0].crowns,
              }], 
              
        opponent: [{
              tag: battle.opponent[0].tag,
              name: battle.opponent[0].name,
              crowns: battle.opponent[0].crowns,
              }], 
                  
        
      });
      newBattle.save((err, newBattle) => {
        // console.log('saving Battle', newBattle)
        if (err) return next({ err: err});
        if (!newBattle) return next({ message: 'Battle not created.', status: 400 });
        console.log('Battle added to DB')
       
      });
  }
  }

  function updateNewFriendlyBattlesFromAllClans(){
    Clan.find()
    .then(function(data){
      // console.log(data)
      var clans = data;
      // console.log('ALL CLANS IN DATABASE', clans)
      for(var i = 0; i<clans.length; i++){
        getNewFriendlyBattlesByClan(clans[i])
          .then((newBattles) => {
            console.log('newBattles.length', newBattles.length);
            if(newBattles){

              saveBattles(newBattles)
            } else{
              console.log("NO NEW BATTLES")
            }
          },
          function(err) {
            console.log(err)
          })
        
        
      }
    },
    function(err) {
      console.log(err)
    })
  } 

  
  updateNewFriendlyBattlesFromAllClans()

  setInterval(updateNewFriendlyBattlesFromAllClans, 300000);


  

})();
