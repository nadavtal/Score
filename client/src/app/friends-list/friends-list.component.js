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

    FriendListCtrl.$inject = ['$log', 'QueryService', 'usersService', 'localStorage', '$stateParams'];

  function FriendListCtrl($log, QueryService, usersService, localStorage, $stateParams) {
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
          console.log(vm.user)
          console.log(vm.currentUser, vm.user)
          if(vm.currentUser._id == vm.user._id){
            vm.isUser = true
          }
          
        })
      
      }
      
    };

    

    vm.removeFriend = function(index){
      vm.user.friends.splice(index, 1)
      usersService.editUser(vm.user)
        .then(function(updatedUser) {
          console.log(updatedUser);
          var updatedUser = updatedUser.data.data;
          console.log('updatedUser', updatedUser);
          $log.debug('updatedUser', updatedUser);



          ngDialog.open({
            template: '\
              <p>'+ updatedUser.username +'Update successful!</p>\
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

    /// definitions

    /**
     * Get users
     */
    
  }

})();
