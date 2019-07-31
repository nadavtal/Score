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
      .service('accountsService', accountsService);
  
      accountsService.$inject = ['$http', 'CONSTANTS', 'QueryService'];
  
    function accountsService($http, CONSTANTS, QueryService) {
      
      
      
      this.creatAccount = creatAccount;
      
      this.getAccount = getAccount;
      this.checkIfAccountExists = checkIfAccountExists; 
      this.getAllAccountsFromDataBase = getAllAccountsFromDataBase;
      this.getAccountsByUserID = getAccountsByUserID  ;
      this.getAccountsByPlatform = getAccountsByPlatform 
      
  
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
      function getAccount(accountId){
        
        return QueryService.query('GET', 'clashaccounts/'+accountId, null, null)
      }
  
  
      function creatAccount(account){
          
            return QueryService.query('POST', 'accounts', null, account)
          }
            
          
      
  
      function getAllAccountsFromDataBase(){
        return QueryService.query('GET', 'accounts/', null, null)
      }
  
      function getAccountsByPlatform(platformName){
        return QueryService.query('GET', 'accounts/platforms/'+platformName, null, null)
      }

      function getAccountsByUserID(userId){
        return QueryService.query('GET', 'accounts/'+userId, null, null)
      }
  
      function checkIfAccountExists(account){
        var promise = new Promise((resolve, reject)=> {
          var accounttoUpaload = account
          getOneAccount(account.name)
          .then((account)=> {
            // console.log(account)
            if(account.data.name){
              console.log('inDB')
              resolve(false)
            } else{
              resolve(accounttoUpaload)
            }
          })
        })
        
        return promise  
      }
  
      
  
      
  
      
  
    }
  
  })();
  