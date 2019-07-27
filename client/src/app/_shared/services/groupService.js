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
      .service('groupsService', groupsService);
  
      groupsService.$inject = ['$http', 'CONSTANTS', 'QueryService'];
  
    function groupsService($http, CONSTANTS, QueryService) {
      
      
      
      this.addGroupToDB = addGroupToDB;
      
      this.getGroup = getGroup;
      this.checkIfGroupExists = checkIfGroupExists; 
      this.getAllGroupsFromDataBase = getAllGroupsFromDataBase;
      this.getGroupsByUserID = getGroupsByUserID  ;
      this.getGroupsByPlatform = getGroupsByPlatform 
      
  
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
      
      function getGroup(groupId) {
        if (!groupId) return;
        return QueryService
          .query('GET', 'groups/' + groupId, null, null)
          
      }

      
  
      function addGroupToDB(Group){
          
            return QueryService.query('POST', 'Groups', null, Group)
          }
            
      function getAllGroupsFromDataBase(){
        return QueryService.query('GET', 'Groups/', null, null)
      }
  
      function getGroupsByPlatform(platformName){
        return QueryService.query('GET', 'Groups/platforms/'+platformName, null, null)
      }

      function getGroupsByUserID(userId){
        return QueryService.query('GET', 'Groups/'+userId, null, null)
      }
  
      function checkIfGroupExists(Group){
        var promise = new Promise((resolve, reject)=> {
          var GrouptoUpaload = Group
          getOneGroup(Group.name)
          .then((Group)=> {
            // console.log(Group)
            if(Group.data.name){
              console.log('inDB')
              resolve(false)
            } else{
              resolve(GrouptoUpaload)
            }
          })
        })
        
        return promise  
      }
  
      
  
      
  
      
  
    }
  
  })();
  