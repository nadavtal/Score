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
      .service('messagesService', messagesService);
  
      messagesService.$inject = ['$http', 'CONSTANTS', 'QueryService'];
  
    function messagesService($http, CONSTANTS, QueryService) {
      
      
      
      
      
      this.getMessage = getMessage;
      this.createMessage = createMessage
      this.checkIfMessageExists = checkIfMessageExists; 
      this.getAllMessages = getAllMessages;
      this.getMessagesByUserID = getMessagesByUserID;
      this.getMessagesByGroupId = getMessagesByGroupId;
      this.getMessagesByPlatform = getMessagesByPlatform 
      
  
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
      
      function getMessage(messageId) {
        if (!messageId) return;
  
        return QueryService
          .query('GET', 'messages/' + messageId, null, null)
      }
      function createMessage(message) {
        console.log(message)
        if (!message) return;
  
        return QueryService
          .query('POST', 'messages/', null, message)
      }

      
            
      function getAllMessages(){
        return QueryService.query('GET', 'messages/', null, null)
      }
  
      function getMessagesByPlatform(platformName){
        return QueryService.query('GET', 'messages/platforms/'+platformName, null, null)
      }

      function getMessagesByUserID(userId){
        return QueryService.query('GET', 'messages/user/'+userId, null, null)
      }
      function getMessagesByGroupId(groupId){
        return QueryService.query('GET', 'messages/group/'+groupId, null, null)
      }
  
      function checkIfMessageExists(message){
        var promise = new Promise((resolve, reject)=> {
          var messagetoUpaload = message
          getOneMessage(message.name)
          .then((message)=> {
            // console.log(message)
            if(message.data.name){
              console.log('inDB')
              resolve(false)
            } else{
              resolve(messagetoUpaload)
            }
          })
        })
        
        return promise  
      }
  
      
  
      
  
      
  
    }
  
  })();
  