;(function() {

  'use strict';

  /**
   * Users endpoint controller
   * @desc Handler functions for all /users routes
   */
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var Clan = require('./clan.model.js');

  var utils = require('../utils/utils.js');
  var request = require("request");
  var Battle = require('../battle/battle.model');
  // public
  module.exports = {
    createClan,
    getClansFromDatabase,
    getClashClan,
    getAllClanBattles, 
    createFriendlyBattle, 
    getAllFriendlyBattles, 
    getBattle
    
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

  function getClashClan(req, res){
    var clanId = req.params.clanId
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
          
        
        res.send(body)
          
      })
  }

  function getAllClanBattles(clanTag){

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
              tag: params.team[0].tag,
              name: params.team[0].name,
              crowns: params.team[0].crowns,
              }], 
                  
        
      });
      console.log(battle)
      // req params validation for required fields
      // req.checkBody('clanTag', 'clanTag must be defined').notEmpty();
      
  
      // validate user input
      var errors = req.validationErrors();
      if (errors) {
          utils.sendJSONresponse(res, 400, errors);
          return;
      }
  
      battle.save((err, newBattle) => {
        console.log('saving Clan', newBattle)
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
        pageNumber: battles.page,
        itemsPerPage: battles.limit,
        prev: res.locals.paginate.href(true),
        next: res.locals.paginate.href(),
      };

      utils.sendJSONresponse(res, 200, battles, false, pagination);
    });
  }

  function getBattle(req, res, next){
    var params = req.params
    Battle
      .findOne({
        battleTime: params.battleTime
        
      })
      .exec(function(err, battle){
        res.send(battle)
      })
  }

  

})();
