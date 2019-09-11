;(function() {

  'use strict';

  /**
   * tournament endpoint controller
   * @desc Handler functions for all /tournament routes
   */
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var Tournament = require('./tournament.model.js');

  var utils = require('../utils/utils.js');


  // public
  module.exports = {
    createTournament,
    getAllTournaments,
    getTournament,
    updateTournament,
    removeTournament,
    getTournamentsByUserId,
    getTournamentsManagedByUserName,
    getTournamentsByGroupId,
    getTournamentsByplatformName,
    getTournamentsByBuyin,
    getTournamentsByNumPlayers,
    getTournamentsByPrizePool,
    getAllTournamentsByPrivacy,
    getTournamentsBytime
  };

  /// definitions

   /**
   * Create new tournament
   * POST '/tournaments'
   */
  function createTournament(req, res, next) {
    
    var params = req.body;
    console.log('creating tournament with params:', params)
    var tournament = new Tournament({
      name: params.name,
      manager: params.manager,
      platform : params.platform,
      maxPlayers: params.maxPlayers,
      playerPerBattle: params.playerPerBattle,
      rounds: params.rounds,
      buyIn: params.buyIn,
      placesPaid: params.placesPaid,
      winners : params.winners,
      registered: params.registered,
      prizePool : params.prizePool,
      optionalPlayers: params.optionalPlayers,
      winsToWinRound: params.winsToWinRound,
      winner: params.winner, 
      time: params.time,
      timeoptions: params.timeoptions,
      group: params.group,
      tree: params.tree,
      privacy: params.privacy
            
    });
    console.log('tournament before saving:', tournament)
    // req params validation for required fields
    
    req.checkBody('platform', 'platform must be defined').notEmpty();
    req.checkBody('manager', 'manager must be defined').notEmpty();

    // validate user input
    var errors = req.validationErrors();
    if (errors) {
      console.log('error creating tournament')
      utils.sendJSONresponse(res, 400, errors);
      return;
    } else{
      tournament.save((err, newTournament) => {
        console.log('saved tournament', newTournament)
        if (err) return next({ err: err, status: 400 });
        if (!newTournament) return next({ message: 'Tournament not created.', status: 400 });
  
        utils.sendJSONresponse(res, 201, newTournament);
      });
    }

    
  }
/**
   * Update tournament
   * PUT '/tournaments/:userId'
   */
  function updateTournament(req, res, next) {
    // console.log(req.body)
    var bodyParams = req.body;
    
    console.log(bodyParams)

    Tournament
      .findOneAndUpdate(
        { _id: ObjectId(bodyParams._id) },
        { '$set': {
          'name': bodyParams.name,
          'manager': bodyParams.manager,
          'platform' : bodyParams.platform,
          'maxPlayers': bodyParams.maxPlayers,
          'playerPerBattle': bodyParams.playerPerBattle,
          'rounds': bodyParams.rounds,
          'buyIn': bodyParams.buyIn,
          'placesPaid': bodyParams.placesPaid,
          'winners' : bodyParams.winners,
          'registered': bodyParams.registered,
          'prizePool' : bodyParams.prizePool,
          'optionalPlayers': bodyParams.optionalPlayers,
          'winsToWinRound': bodyParams.winsToWinRound,
          'winner': bodyParams.winner, 
          'time': bodyParams.time,
          'timeoptions': bodyParams.timeoptions,
          'group': bodyParams.group,
          'tree': bodyParams.tree,
          'privacy': bodyParams.privacy
 }
        },
        { upsert: false, new: true, fields: { password: 0 }, runValidators: true, setDefaultsOnInsert: true })
      .exec((err, tournament) => {
        if (err) return next({ err: err, status: 400 });
        if (!tournament) return next({
          message: 'Tournament not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 200, tournament);
      });
  }

  /**
   * Get tournaments (paginated)
   * GET '/tournaments/'
   */
  function getAllTournaments(req, res, next) {
    console.log('getting all tournaments', req.query)
    var page = req.query.page || 1;
    var limit = req.query.limit || 100;


    // Tournament.find({}, function (err, tournaments) {
    //   res.send(tournaments);
    // });

    var options = {
        page: page,
        limit: limit,
        lean: true
    };

    if(req.query.privacy){
      Tournament.paginate({$and: [{'privacy' : req.query.privacy}, {'time' : { $gt :  req.query.time}}]}, options, (err, tournaments) => {
        // console.log(tournaments)
        if (err) return next(err);
        if (!tournaments) return next({
          message: 'No tournaments found.',
          status: 404
        });
  
        var pagination = {
          pageNumber: tournaments.page,
          itemsPerPage: tournaments.limit,
          prev: res.locals.paginate.href(true),
          next: res.locals.paginate.href(),
        };
  
        utils.sendJSONresponse(res, 200, tournaments, false, pagination);
      });
    } 
    else{
      Tournament.paginate({}, options, (err, tournaments) => {
        // console.log(tournaments)
        if (err) return next(err);
        if (!tournaments) return next({
          message: 'No tournaments found.',
          status: 404
        });
  
        var pagination = {
          pageNumber: tournaments.page,
          itemsPerPage: tournaments.limit,
          prev: res.locals.paginate.href(true),
          next: res.locals.paginate.href(),
        };
  
        utils.sendJSONresponse(res, 200, tournaments, false, pagination);
      });
    }

    
  }
  /**
   * Get tournaments by privacy settings (paginated)
   * GET '/tournaments/'
   */
  function getAllTournamentsByPrivacy(req, res, next) {
    console.log('getting all '+ req.query.privacy +'tournaments')
    var page = req.query.page || 1;
    var limit = req.query.limit || 100;


    // Tournament.find({}, function (err, tournaments) {
    //   res.send(tournaments);
    // });

    var options = {
        page: page,
        limit: limit,
        lean: true
    };



    Tournament.paginate({'privacy' : req.query.privacy}, options, (err, tournaments) => {
      // console.log(tournaments)
      if (err) return next(err);
      if (!tournaments) return next({
        message: 'No tournaments found.',
        status: 404
      });

      var pagination = {
        pageNumber: tournaments.page,
        itemsPerPage: tournaments.limit,
        prev: res.locals.paginate.href(true),
        next: res.locals.paginate.href(),
      };

      utils.sendJSONresponse(res, 200, tournaments, false, pagination);
    });
  }

  /**
   * Get tournaments by user
   * GET '/tournaments/:userId'
   */
 

  function getTournamentsByUserId(req,res,next){
    
    
    var params = req.params;
    if(req.query.time){
      console.log('getting tournaments by userId and time:', req.query);
      Tournament.find({$and : [{ 'registered.userId': params.userId }, {'time' : { $gt :  req.query.time}}]}, { 'registered.$': 1 })
      .exec((err, data) => {
        // console.log(data)
        if (err) return next(err);
        if (!data) return next({
          message: 'groups not found.',
          status: 404
        });
        var tournamentsIds = []
        for (var i = 0; i < data.length; i++){
          // console.log(data[i]);
          tournamentsIds.push(data[i]._id);
          
        }
        // console.log('IDS', tournamentsIds);
        
        
      })
      .then((tournamentsIds)=> {
        Tournament.find({'_id': { $in: tournamentsIds }})
        .exec((err, data) => {
          if (err) return next(err);
          if (!data) return next({
            message: 'tournaments not found.',
            status: 404
          });
          utils.sendJSONresponse(res, 200, data);
        
        });
      })
    } else{
      console.log('getting tournaments by userId :', req.query);
      Tournament.find({ 'registered.userId': params.userId }, { 'registered.$': 1 })
      .exec((err, data) => {
        // console.log(data)
        if (err) return next(err);
        if (!data) return next({
          message: 'groups not found.',
          status: 404
        });
        var tournamentsIds = []
        for (var i = 0; i < data.length; i++){
          // console.log(data[i]);
          tournamentsIds.push(data[i]._id);
          
        }
        // console.log('IDS', tournamentsIds);
        
        
      })
      .then((tournamentsIds)=> {
        Tournament.find({'_id': { $in: tournamentsIds }})
        .exec((err, data) => {
          if (err) return next(err);
          if (!data) return next({
            message: 'tournaments not found.',
            status: 404
          });
          utils.sendJSONresponse(res, 200, data);
        
        });
      })

    }
  }

  function getTournamentsManagedByUserName(req,res,next){
    console.log('getting tournaments managed by userName:', req.params.userName);
    
    var params = req.params;
    if(req.query.time){
      Tournament.find({$and : [{ 'manager': params.userName }, {'time' : { $gt :  req.query.time}}]})
      .exec((err, data) => {
        // console.log(data)
        if (err) return next(err);
        if (!data) return next({
          message: 'groups not found.',
          status: 404
        });
        var tournamentsIds = []
        for (var i = 0; i < data.length; i++){
          // console.log(data[i]);
          tournamentsIds.push(data[i]._id);
          
        }
        // console.log('IDS', tournamentsIds);
        
        
      })
      .then((tournamentsIds)=> {
        Tournament.find({'_id': { $in: tournamentsIds }})
        .exec((err, data) => {
          if (err) return next(err);
          if (!data) return next({
            message: 'tournaments not found.',
            status: 404
          });
          utils.sendJSONresponse(res, 200, data);
        
        });
      })
    } else {
      Tournament.find({ 'manager': params.userName })
      .exec((err, data) => {
        // console.log(data)
        if (err) return next(err);
        if (!data) return next({
          message: 'groups not found.',
          status: 404
        });
        var tournamentsIds = []
        for (var i = 0; i < data.length; i++){
          // console.log(data[i]);
          tournamentsIds.push(data[i]._id);
          
        }
        // console.log('IDS', tournamentsIds);
        
        
      })
      .then((tournamentsIds)=> {
        Tournament.find({'_id': { $in: tournamentsIds }})
        .exec((err, data) => {
          if (err) return next(err);
          if (!data) return next({
            message: 'tournaments not found.',
            status: 404
          });
          utils.sendJSONresponse(res, 200, data);
        
        });
      })

    }
  }

  function getTournamentsByGroupId(req,res,next){
    console.log(req.params);
    var params = req.params;
    Tournament.find({ 'group': params.groupId })
    .exec((err, data) => {
      if (err) return next(err);
      if (!data) return next({
        message: 'groups not found.',
        status: 404
      });
      var tournamentsIds = []
      for (var i = 0; i < data.length; i++){
        console.log(data[i]);
        tournamentsIds.push(data[i]._id);
        
      }
      console.log('IDS', tournamentsIds);
      
      
    })
    .then((tournamentsIds)=> {
      Tournament.find({'_id': { $in: tournamentsIds }})
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
   * Get tournaments by tournamentID
   * GET '/tournaments/:tournamentId'
   */
  function getTournament(req, res, next) {
    var params = req.params;

    Tournament
      .findOne({ '_id': ObjectId(params.tournamentId) }, { password: 0, __v: 0 })
      .exec((err, tournament) => {
        if (err) return next(err);
        if (!tournament) return next({
          message: 'tournament not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 200, tournament);
      });
  }

  function removeTournament(req, res, next){
    // console.log('removing tournament')
    var params = req.params;
    console.log('removing tournament',params.tournamentId)
    Tournament
      .deleteOne({ _id: params.tournamentId },  function(err, tournament) {
      //do something smart
      console.log(tournament)
      if (err) return next(err);
      if (!tournament) return next({
        message: 'tournament not found.',
        status: 404
      });

      utils.sendJSONresponse(res, 200, tournament);
  });
    
  }

  function getTournamentsByplatformName(req,res,next){
    console.log('getting tournaments by platformName:', req.params.platformName);
    
    var params = req.params;
    
    Tournament.find({ 'platform': params.platformName })
    .exec((err, data) => {
      // console.log(data)
      if (err) return next(err);
      if (!data) return next({
        message: 'tounaments not found.',
        status: 404
      });
      utils.sendJSONresponse(res, 200, data);
      var tournamentsIds = []
      // for (var i = 0; i < data.length; i++){
      //   // console.log(data[i]);
      //   tournamentsIds.push(data[i]._id);
        
      // }
      // console.log('IDS', tournamentsIds);
      
      
    })
    // .then((tournamentsIds)=> {
    //   Tournament.find({'_id': { $in: tournamentsIds }})
    //   .exec((err, data) => {
    //     if (err) return next(err);
    //     if (!data) return next({
    //       message: 'tournaments not found.',
    //       status: 404
    //     });
    //     utils.sendJSONresponse(res, 200, data);
      
    //   });
    // })
  }
  function getTournamentsByBuyin(req,res,next){
    
    var params = req.params;
    console.log('getting tournaments by buyin:', params);
    var min = parseInt(params.min)-1;
    var max = parseInt(params.max)+1;
    // console.log(min, max)
    Tournament.find({ buyIn : { $gt :  min, $lt : max}})
    .exec((err, data) => {
      // console.log(data)
      if (err) return next(err);
      if (!data) return next({
        message: 'tounaments not found.',
        status: 404
      });
      utils.sendJSONresponse(res, 200, data);
      
      
    })
    
  }
  function getTournamentsByNumPlayers(req,res,next){
    var params = req.params;
    console.log('getting tournaments by maxPlayers:', params);
    var min = parseInt(params.min)-1;
    var max = parseInt(params.max)+1;
    Tournament.find({ maxPlayers : { $gt :  min, $lt : max}})
    .exec((err, data) => {
      // console.log(data)
      if (err) return next(err);
      if (!data) return next({
        message: 'tounaments not found.',
        status: 404
      });
      utils.sendJSONresponse(res, 200, data);
    })
   }

  function getTournamentsByPrizePool(req,res,next){
    var params = req.params;
    console.log('getting tournaments by prizePool:', params);
    var min = parseInt(params.min)-1;
    var max = parseInt(params.max)+1;
    Tournament.find({ prizePool : { $gt :  min, $lt : max}})
    .exec((err, data) => {
      // console.log(data)
      if (err) return next(err);
      if (!data) return next({
        message: 'tounaments not found.',
        status: 404
      });
      utils.sendJSONresponse(res, 200, data);
    })
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

  function getTournamentsBytime(req, res, next){
    var params = req.params;
    console.log('getting tournaments by time:', params);
    if(params.operator == '$lt'){
      Tournament.find({ 'time' : { $gt :  params.date}})
      .exec((err, data) => {
        // console.log(data)
        if (err) return next(err);
        if (!data) return next({
          message: 'tounaments not found.',
          status: 404
        });
        utils.sendJSONresponse(res, 200, data);
        
        
      })
    } else if (params.operator == '$gt'){
      Tournament.find({ 'time' : { $gt :  params.date}})
      .exec((err, data) => {
        // console.log(data)
        if (err) return next(err);
        if (!data) return next({
          message: 'tounaments not found.',
          status: 404
        });
        utils.sendJSONresponse(res, 200, data);
        
        
      })
    } else{
      Tournament.find({ 'time' : { $gt :  params.date}})
      .exec((err, data) => {
        // console.log(data)
        if (err) return next(err);
        if (!data) return next({
          message: 'tounaments not found.',
          status: 404
        });
        utils.sendJSONresponse(res, 200, data);
        
        
      })
    }
    // var operator = JSON.parse(params.operator);
    
    
    
  }

})();
