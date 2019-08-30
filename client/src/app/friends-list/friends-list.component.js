;(function() {
 
  'use strict';

  /**
   * Show user list table
   *
   * @usage <user-list users="vm.games"></user-list>
   */

  angular
    .module('boilerplate')
    .component('friendsList', {
      bindings: {
        games: '<'
      },
      templateUrl: 'app/friends-list/friends-list.html',
      controllerAs: 'vm',
      controller: FriendListCtrl
    });

    FriendListCtrl.$inject = ['$log', 'messagesService', 'usersService', 'localStorage', '$stateParams', 'groupsService', 'friendsService', 'ngDialog'];

  function FriendListCtrl($log, messagesService, usersService, localStorage, $stateParams, groupsService, friendsService, ngDialog) {
    // console.log('friendList component')
    var vm = this;
    vm.sendMessageToUser = sendMessageToUser
    
    
    vm.$onInit = function() {

      var userId = vm.userId || $stateParams.userId;
      
      vm.isUser = false
      vm.currentUser = localStorage.get('user');
      
      if (userId){
        usersService.getUser(userId)
        .then((user) => {
          vm.user = user.data.data
         
          console.log('vm.user: ', vm.user);
          
          if(vm.currentUser._id == vm.user._id){
            vm.isUser = true
          }

          if(vm.user.friends.length > 0){
            getUsersProfiles(vm.user.friends)
            .then(data => {
              vm.friends = data
              console.log('friends', vm.friends);
            })
          }
          

          groupsService.getGroupsByUserID(userId)
            .then(function(groups) {
              vm.groups = groups.data.data;
              // console.log('groups', vm.groups)
              $log.debug('groups', vm.groups);
              // console.log(vm.user)
              for (var i=0; i<vm.friends.length; i++){
                // console.log(vm.friends[i].userId);
                var sharedGroups = findSharedGroupsWithUser(vm.groups, vm.friends[i]._id);
                vm.friends[i].sharedGroups = sharedGroups
                // console.log(vm.friends[i])
                 } 
            })
            .catch(function(err) {
              $log.debug(err);
            });
          
          
          
            
          
        })
      
      }
      
    };

    

    vm.removeFriend = function(index, user){
      console.log(user, vm.user);
      friendsService.removeFromFriends(user, vm.user)
      console.log(user, vm.user);
      usersService.editUser(user, user._id);
        
      usersService.editUser(vm.user, vm.user._id)
      .then(function(updatedUser) {
        vm.user = updatedUser.data.data
        console.log(vm.user);
        vm.friends = vm.friends.filter(function( obj ) {
          return obj._id !== user._id;
        });
        if(vm.user._id == vm.currentUser._id){
          localStorage.update('user', vm.user)
        }
        // if(vm.user.friends.length > 0){
        //   getUsersProfiles(vm.user.friends)
        //     .then(data => {
        //       vm.friends = data
        //       console.log('friends', vm.friends);
        //     })
        // } else{
        //   vm.friends = [];
        // }
        
        
      });
      // localStorage.update('user', vm.user);
      vm.areFriends = false;
    }

    vm.removeAllFriends = function (){
      vm.user.friends = [];
      vm.friends = [];
      console.log(vm.user);
      usersService.editUser(vm.user)
        .then(function(updatedUser) {
          // console.log(updatedUser);
          var updatedUser = updatedUser.data.data;
          console.log('updatedUser', updatedUser);
          vm.user = updatedUser;

          // localStorage.update('user', updatedUser)
        })
    }

    

    /// definitions
    function findSharedGroupsWithUser(groupsArray, user){
      // console.log(groupsArray.length, user)
      var sharedGroups = []
      for (var i=0; i<groupsArray.length; i++){
        // console.log(groupsArray[i])
        for (var j=0; j< groupsArray[i].members.length; j++){
          // console.log(groupsArray[i].members[j].userId, user)
          if (groupsArray[i].members[j].userId == user){
            // console.log('foundShared group')
            sharedGroups.push(groupsArray[i])
            // console.log(sharedGroups)
          }
        }
      }
      // console.log(sharedGroups)
      return sharedGroups;

    }

    function getUsersProfiles(users){
      var promiseArr = [];
      
        console.log(users)
        for (var i = 0; i<users.length; i++){
          let promise = new Promise(function(resolve, reject){
            // console.log(i, users[i].userId);
            usersService.getUser(users[i].userId)
            .then(user =>{
              console.log(user);
              // users[i] = user.data.data
              // console.log(i);
              resolve(user.data.data);
              // if (i == users.length-1){
                
                
              // }
            });
          });
          promiseArr.push(promise)
          

          
            
        }
        
      
        return Promise.all(promiseArr)
    }

    function sendMessageToUser(user){
      messagesService.sendMessageToUser(user, vm.currentUser)
    }
    /**
     * Get users
     */
    
  }

})();
