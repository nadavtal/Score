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

    FriendListCtrl.$inject = ['$log', 'QueryService', 'usersService', 'localStorage', '$stateParams', 'groupsService', 'utils', 'ngDialog'];

  function FriendListCtrl($log, QueryService, usersService, localStorage, $stateParams, groupsService, utils, ngDialog) {
    // console.log('friendList component')
    var vm = this;
    
    
    
    vm.$onInit = function() {

      var userId = vm.userId || $stateParams.userId;
      
      vm.isUser = false
      vm.currentUser = localStorage.get('user');
      console.log(userId)
      if (userId){
        usersService.getUser(userId)
        .then((user) => {
          vm.user = user.data.data
         
          console.log(vm.currentUser, vm.user)
          if(vm.currentUser._id == vm.user._id){
            vm.isUser = true
          }

          groupsService.getGroupsByUserID(userId)
            .then(function(groups) {
              vm.groups = groups.data.data;
              console.log('groups', vm.groups)
              $log.debug('groups', vm.groups);
              console.log(vm.user)
              for (var i=0; i<vm.user.friends.length; i++){
                console.log(vm.user.friends[i].userId);
                var sharedGroups = findSharedGroupsWithUser(vm.groups, vm.user.friends[i].userId);
                vm.user.friends[i].sharedGroups = sharedGroups
                console.log(vm.user.friends[i])
                 } 
            })
            .catch(function(err) {
              $log.debug(err);
            });
          
          
          
            
          
        })
      
      }
      
    };

    

    vm.removeFriend = function(index){
      vm.user.friends.splice(index, 1)
      usersService.editUser(vm.user)
        .then(function(updatedUser) {
          // console.log(updatedUser);
          var updatedUser = updatedUser.data.data;
          console.log('updatedUser', updatedUser);
          $log.debug('updatedUser', updatedUser);



          ngDialog.open({
            template: '\
              <p>'+ updatedUser.userName +'Update successful!</p>\
              <div class=\"ngdialog-buttons\">\
                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
              </div>',
            plain: true
          });

        })
        .catch(function(err) {
          $log.debug(err);
        });
    }

    vm.sendMessageToUser = sendMessageToUser

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

    function sendMessageToUser(user){
      console.log(vm.currentUser, user)
      user._id = user.userId
      var users = {
        sender: vm.currentUser,
        receiver: user,
        messageType: 'privateChatMessage'
      }
      var dialog = ngDialog.open({
        template: '\
          <message-form-directive></message-form-directive>',
        plain: true,
        data: users
      });
    }
    /**
     * Get users
     */
    
  }

})();
