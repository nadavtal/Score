;(function() {

    'use strict';
  
    /**
     * $http service abstraction to make API calls with any HTTP method,
     * custom url, and params.
     *
     * @category  service
     * @author    Jozef Butko
     * @example   Inject QueryService as the dependency and then use it this way:
     *
     * 
     *
     */
  
    angular
      .module('boilerplate')
      .service('gamesService', gamesService);
  
      gamesService.$inject = ['$http', 'CONSTANTS', 'QueryService'];
  
    function gamesService($http, CONSTANTS, QueryService) {
      
      
    
      this.getGame = getGame;
      this.createGame = createGame;
      this.removeGame = removeGame;
      this.checkIfGameExists = checkIfGameExists; 
      this.getAllGamesFromDataBase = getAllGamesFromDataBase;
      this.getGamesByUserID = getGamesByUserID;
      this.getGamesByGroupId = getGamesByGroupId;
      this.getGamesByPlatform = getGamesByPlatform 
      
  
      /// definitions
  
      /**
       * Make http request of any method with params
       * @param  {string} method     HTTP method
       * @param  {styring} url       URL
       * @param  {object} getParams  GET params in case of GET request
       * @param  {object} postParams POST/PUT params in case of POST/PUT requests
       * @param  {object} headers    Headers
       * @return {object}            Promise
       */
      
      function getGame(gameId) {
        if (!gameId) return;
  
        return QueryService
          .query('GET', 'games/' + gameId, null, null)
      }
      function createGame(game) {
        console.log(game)
        if (!game) return;
  
        return QueryService
          .query('POST', 'games/', null, game)
      }
      function removeGame(gameId) {
        console.log(gameId)
        if (!gameId) return 'no gameId';
  
        return QueryService
        .query('POST', 'games/'+ gameId, null, null)
      }

            
      function getAllGamesFromDataBase(){
        return QueryService.query('GET', 'games/', null, null)
      }
  
      function getGamesByPlatform(platformName){
        return QueryService.query('GET', 'games/platforms/'+platformName, null, null)
      }

      function getGamesByUserID(userId){
        return QueryService.query('GET', 'games/user/'+userId, null, null)
      }
      function getGamesByGroupId(groupId){
        return QueryService.query('GET', 'games/group/'+groupId, null, null)
      }
  
      function checkIfGameExists(game){
        var promise = new Promise((resolve, reject)=> {
          var gametoUpaload = game
          getOneGame(game.name)
          .then((game)=> {
            // console.log(game)
            if(game.data.name){
              console.log('inDB')
              resolve(false)
            } else{
              resolve(gametoUpaload)
            }
          })
        })
        
        return promise  
      }
  
      
  
      
  
      
  
    }
  
  })();
  