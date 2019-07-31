(function() {

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
      .service('gameTypesService', gameTypesService);
  
      gameTypesService.$inject = ['$http', 'CONSTANTS', 'QueryService'];
  
    function gameTypesService($http, CONSTANTS, QueryService) {
      
      
      
      this.addGameTypeToDB = addGameTypeToDB;
      
      this.getOneGameType = getOneGameType;
      this.checkIfGameTypeExists = checkIfGameTypeExists; 
      this.getAllGameTypes = getAllGameTypes   
      
  
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
      function getGameType(gameTypeId){
        
        return QueryService.query('GET', 'clashgameTypes/'+reparedUserId, null, null)
      }
  
  
      
  
      function getAllBattlesByGameType(gameType){
        var promiseArr = [];
            for (var i = 0; i < gameType.data.memberList.length; i++) {
                var promise = new Promise(function(resolve, reject) {
                  
                  var reparedUserId = '%23'+ gameType.data.memberList[i].tag.slice(1, gameType.data.memberList[i].tag.length)
          
                    QueryService
                    .query('GET', 'clashusers/'+reparedUserId+'/battles', null, null)
                    .then(function(battles) {
                      console.log('got battles of player');
                      resolve(battles)
                    })
                    
                });
                promiseArr.push(promise);
            }
            // console.log(promiseArr)
            return Promise.all(promiseArr)
      }
  
      
  
      
  
      function addGameTypeToDB(gameType){
            console.log(gameType)
            return QueryService.query('POST', 'gameTypes', null, gameType)
          }
            
          
      
  
      function getAllGameTypes(){
        return QueryService.query('GET', 'gameTypes/', null, null)
      }
  
      function getOneGameType(gameTypeId){
        return QueryService.query('GET', 'gameTypes/'+gameTypeId, null, null)
      }
  
      function checkIfGameTypeExists(gameType){
        var promise = new Promise((resolve, reject)=> {
          var gameTypetoUpaload = gameType
          getOneGameType(gameType.name)
          .then((gameType)=> {
            // console.log(gameType)
            if(gameType.data.name){
              console.log('inDB')
              resolve(false)
            } else{
              resolve(gameTypetoUpaload)
            }
          })
        })
        
        return promise  
      }
  
      
  
      
  
      
  
    }
  
  })();
  