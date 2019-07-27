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
      .service('platformService', platformService);
  
      platformService.$inject = ['$http', 'CONSTANTS', 'QueryService'];
  
    function platformService($http, CONSTANTS, QueryService) {
      
      
      
      this.addPlatformToDB = addPlatformToDB;
      
      this.getOnePlatform = getOnePlatform;
      this.checkIfPlatformExists = checkIfPlatformExists; 
      this.getAllPlatformsFromDataBase = getAllPlatformsFromDataBase   
      
  
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
      function getPlatform(platformId){
        
        return QueryService.query('GET', 'clashplatforms/'+reparedUserId, null, null)
      }
  
  
      
  
      function getAllBattlesByPlatform(platform){
        var promiseArr = [];
            for (var i = 0; i < platform.data.memberList.length; i++) {
                var promise = new Promise(function(resolve, reject) {
                  
                  var reparedUserId = '%23'+ platform.data.memberList[i].tag.slice(1, platform.data.memberList[i].tag.length)
          
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
  
      
  
      
  
      function addPlatformToDB(platform){
          
            return QueryService.query('POST', 'platforms', null, platform)
          }
            
          
      
  
      function getAllPlatformsFromDataBase(){
        return QueryService.query('GET', 'platforms/', null, null)
      }
  
      function getOnePlatform(time){
        return QueryService.query('GET', 'platforms/'+time, null, null)
      }
  
      function checkIfPlatformExists(platform){
        var promise = new Promise((resolve, reject)=> {
          var platformtoUpaload = platform
          getOnePlatform(platform.name)
          .then((platform)=> {
            // console.log(platform)
            if(platform.data.name){
              console.log('inDB')
              resolve(false)
            } else{
              resolve(platformtoUpaload)
            }
          })
        })
        
        return promise  
      }
  
      
  
      
  
      
  
    }
  
  })();
  