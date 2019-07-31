;(function() {

    'use strict';
  
    
    angular
      .module('boilerplate')
      .service('friendsService', friendsService);
  
      friendsService.$inject = ['$http', 'CONSTANTS', 'QueryService'];
  
    function friendsService($http, CONSTANTS, QueryService) {
      
      
      
      this.checkIfFriends = checkIfFriends;
      
      
      
  
      function checkIfFriends(user1, user2){
        // console.log(user1)
        // console.log(user2)
        if(!user1.friends.length){
          console.log(user1.userName + ' has no friends');
          return false
        };
        if(!user2.friends.length){
          console.log(user2.userName + ' has no friends');
          return false
        };
        for (var i=0; i<user1.friends.length; i++){
          if(user1.friends[i].userId == user2._id){
            // console.log(user1.friends[i].userId, user2._id)
            return true
          }
        }
      }
  
    }
  
  })();
  