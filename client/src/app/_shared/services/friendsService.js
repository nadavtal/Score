;(function() {

    'use strict';
  
    
    angular
      .module('boilerplate')
      .service('friendsService', friendsService);
  
      friendsService.$inject = ['$http', 'CONSTANTS', 'QueryService', 'usersService'];
  
    function friendsService($http, CONSTANTS, QueryService, usersService) {
      
      
      
      this.checkIfFriends = checkIfFriends;
      this.addToFriends = addToFriends;
      this.removeFromFriends = removeFromFriends;
      
  
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

      function addToFriends(userToAdd, targetUser){
        // console.log('userToAdd: ', userToAdd);
        // console.log('add to: ', targetUser);
        if(!userToAdd) return;
        if(!targetUser) return;
  
        if(targetUser.friends){
          targetUser.friends.push({
            userName :userToAdd.userName,
            userId: userToAdd._id
          })
  
        } else{
          targetUser.friends = [];
          targetUser.friends.push({
            userName :userToAdd.userName,
            userId: userToAdd._id
          })
  
        }
        if(userToAdd.friends){
          userToAdd.friends.push({
            userName :targetUser.userName,
            userId: targetUser._id
          })
  
        } else{
          userToAdd.friends = [];
          userToAdd.friends.push({
            userName :targetUser.userName,
            userId: targetUser._id
          })
  
        }
       
      }

      function removeFromFriends(userToRemove, targetUser){
        console.log('userToRemove: ', userToRemove);
        console.log('remove from: ', targetUser);
        if(!userToRemove) return 'there is no "userToRemove"';
        if(!targetUser) return 'there is no "targetUser"';
        
        targetUser.friends = targetUser.friends.filter(function( obj ) {
          return obj.userId !== userToRemove._id;
        }); 
        userToRemove.friends = userToRemove.friends.filter(function( obj ) {
          return obj.userId !== targetUser._id;
        }); 
      }
 
    }
  
  })();
  