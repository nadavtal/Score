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
  
      messagesService.$inject = ['$http', 'CONSTANTS', 'QueryService', 'ngDialog'];
  
    function messagesService($http, CONSTANTS, QueryService, ngDialog) {
      
      
      
      
      
      this.getMessage = getMessage;
      this.createMessage = createMessage
      this.updateMessage = updateMessage
      this.checkIfMessageExists = checkIfMessageExists; 
      this.getAllMessages = getAllMessages;
      this.getMessagesByUserID = getMessagesByUserID;
      this.getMessagesByGroupId = getMessagesByGroupId;
      this.getMessagesByPlatform = getMessagesByPlatform;
      this.sendMessageToUser = sendMessageToUser;
      this.getMessagesFromGroups = getMessagesFromGroups;
      this.sendMessageToGroup = sendMessageToGroup;
      this.createMessagePerUser = createMessagePerUser;
      this.sumUnreadMessages = sumUnreadMessages
      
  
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
        // console.log(message)
        if (!message) return;
  
        return QueryService
          .query('POST', 'messages/', null, message)
      }

      function updateMessage(message) {
        if (!message) return;
        console.log('message before update', message);
        return QueryService
          .query('PUT', 'messages/' + message._id, null, message)
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

      function sendMessageToUser(toUser, fromUser){
        console.log(fromUser, toUser)
        // toUser._id = toUser.userId
        var users = {
          sender: fromUser,
          receiver: toUser,
          messageType: 'privateChatMessage'
        }
        var dialog = ngDialog.open({
          template: '\
            <message-form-directive></message-form-directive>',
          plain: true,
          data: users
        });
      }

      function sendMessageToGroup(group){
        
      }
      

      function getGroupMessagesByUserId(userId, groups){
        var promise = new Promise((resolve, reject) =>{
          var groupMessages = []
          getClanAndBattles(userId)
          .then(function(data){
            // console.log(data);
            for(var i = 0; i<data.length; i++){
              findFriendlyBattles(data[i].data)
              .then((battles)=>{
                for(var j = 0; j<battles.length; j++){
                  groupMessages.push(battles[j])
                }
                resolve(groupMessages)
              })
            }
            
          });
        })
        return promise
      }

      function getMessagesFromGroups(groups){
        var promiseArr = [];
        
        for(var i = 0; i < groups.length; i++){
          var promise = new Promise(function(resolve, reject) {
            getMessagesByGroupId(groups[i]._id)
              .then(function(groupMessages){
                resolve(groupMessages.data.data)
            });
              
          });
          promiseArr.push(promise);
        }
        return Promise.all(promiseArr);
      }

      function createMessagePerUser(users, msg){
        // console.log(users)
        var promiseArr = [];
        
        for(var i = 0; i < users.length; i++){
          var message = JSON.parse(JSON.stringify(msg))
          // console.log(message);
          var promise = new Promise(function(resolve, reject) {
            // var message = msg;
            message.receiver = {
              userName: users[i].userName,
              userId: users[i].userId
            }
            
            // console.log(message.receiver);
            createMessage(message)
              .then(function(message){
                // console.log(message)
                resolve(message.data.data)
            });

            
            
             
              
          });
          promiseArr.push(promise);
        }
        return Promise.all(promiseArr);
      }
  
      function sumUnreadMessages(messages){
        var sum = 0
        for (var i = 0; i < messages.length; i++){
          // console.log(messages[i].status)
          if(messages[i].status == 'unread') sum++
        }
  
        return sum
      }
  
      
  
      
  
    }
  
  })();
  