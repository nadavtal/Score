;(function() {

  'use strict';

  /**
   * Show user list table
   *
   * @usage <user-list users="vm.users"></user-list>
   */

  angular
    .module('boilerplate')
    .component('clashUsers', {
      bindings: {
        users: '='
      },
      templateUrl: 'app/clashUsers/clashUsers.html',
      controllerAs: 'vm',
      controller: clashUserListCtrl
    });

  clashUserListCtrl.$inject = ['$log', 'QueryService', '$rootScope', '$http', 'accountsService'];

  function clashUserListCtrl($log, QueryService, $rootScope, $http, accountsService) {
    var vm = this;
    vm.createClashUser = createClashUser


    vm.$onInit = function() {
      // getClashUsers()
      accountsService.getAccountsByPlatform("Clash")
        .then((accounts)=> {
          vm.accounts = accounts.data.data
          console.log(vm.accounts)
        })
    }
     
    

    /**
     * Get users
     */
    function getClashUsers() {
      QueryService.query('GET', 'clashusers/').then(function(data){
        
        vm.users = data.data.data
        console.log(vm.users)
      })
    }
    

    function createClashUser() {
      console.log(vm.newClashUserTag)
      if (!vm.newClashUserTag) return;

      QueryService
        .query('POST', 'clashusers/', null, {userTag: vm.newClashUserTag})
        .then(function(newClashUser) {
          vm.newClashUser = newClashUser.data.data;
          $log.debug('newClashUser', vm.newClashUser);

          var dialog = ngDialog.open({
            template: '\
              <p>New clan created</p>\
              <div class="ngdialog-buttons">\
                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'ok\')">OK</button>\
              </div>',
            plain: true
          });

          // dialog.closePromise.then(function(closedDialog) {
          //   $state.go('displayUser', { userId: vm.newClashUser._id });
          // });

        })
        .catch(function(err) {
          $log.debug(err);
        });
    }
    
  }

})();
