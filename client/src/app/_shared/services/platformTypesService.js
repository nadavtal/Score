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
      .service('platformTypesService', platformTypesService);
  
      platformTypesService.$inject = ['$http', 'CONSTANTS', 'QueryService'];
  
    function platformTypesService($http, CONSTANTS, QueryService) {
      
      
      
      this.addPlatformTypeToDB = addPlatformTypeToDB;
      
      this.getOnePlatformType = getOnePlatformType;
      this.checkIfPlatformTypeExists = checkIfPlatformTypeExists; 
      this.getAllPlatformTypes = getAllPlatformTypes   
      
  
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
      function getPlatformType(platformTypeId){
        
        return QueryService.query('GET', 'clashplatformTypes/'+reparedUserId, null, null)
      }
  
  
      
  
      function getAllBattlesByPlatformType(platformType){
        var promiseArr = [];
            for (var i = 0; i < platformType.data.memberList.length; i++) {
                var promise = new Promise(function(resolve, reject) {
                  
                  var reparedUserId = '%23'+ platformType.data.memberList[i].tag.slice(1, platformType.data.memberList[i].tag.length)
          
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
  
      
  
      
  
      function addPlatformTypeToDB(platformType){
            console.log(platformType)
            return QueryService.query('POST', 'platformTypes', null, platformType)
          }
            
          
      
  
      function getAllPlatformTypes(){
        return QueryService.query('GET', 'platformTypes/', null, null)
      }
  
      function getOnePlatformType(platformTypeId){
        return QueryService.query('GET', 'platformTypes/'+platformTypeId, null, null)
      }
  
      function checkIfPlatformTypeExists(platformType){
        var promise = new Promise((resolve, reject)=> {
          var platformTypetoUpaload = platformType
          getOnePlatformType(platformType.name)
          .then((platformType)=> {
            // console.log(platformType)
            if(platformType.data.name){
              console.log('inDB')
              resolve(false)
            } else{
              resolve(platformTypetoUpaload)
            }
          })
        })
        
        return promise  
      }
  
      
  
      
  
      
  
    }
  
  })();
  