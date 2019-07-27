;(function() {

  'use strict';

  /**
   * Show user list table
   *
   * @usage <user-list users="vm.users"></user-list>
   */

  angular
    .module('boilerplate')
    .component('userList', {
      bindings: {
        users: '<'
      },
      templateUrl: 'app/user-list/user-list.html',
      controllerAs: 'vm',
      controller: UserListCtrl
    });

  UserListCtrl.$inject = ['$log', 'QueryService', '$rootScope', 'accountsService', 'localStorage', 'gamesService', 'usersService'];

  function UserListCtrl($log, QueryService, $rootScope, accountsService, localStorage, gamesService, usersService) {
    var vm = this;
    vm.changeActiveTab = changeActiveTab;
    vm.toggleAddAccount = toggleAddAccount;
    vm.AddAccountForm = AddAccountForm;

    vm.$onInit = function() {
      vm.activeTab = 'users';
      vm.user = localStorage.get('user');
      vm.showAddAccount = false
      if (!$rootScope.users) {
        usersService.getAllUsers()
          .then((data) => {
            vm.users = data.data.data;
            console.log(vm.users)
          })
      }
      else vm.users = $rootScope.users;

      vm.platforms = localStorage.get('platforms').data;
      console.log(vm.platforms)
      accountsService.getAllAccountsFromDataBase()
      .then((accounts) => {
        vm.accounts = accounts.data.data
        console.log(vm.accounts)
      })

      gamesService.getAllGamesFromDataBase()
        .then((games)=>{
          vm.games = games.data.data;
          console.log(vm.games)
        })

    };

    

    /**
     * Get users
     */
    function getUsers() {
      QueryService
        .query('GET', 'users/', null, null)
        .then(function(user) {
          
          vm.users = user.data.data;
          
          $rootScope.users = vm.users;
          
          $log.debug('users', vm.users);
        })
        .catch(function(err) {
          $log.debug(err);
        });
    }

    function changeActiveTab(tab){
      vm.activeTab = tab;
      
    }

    function toggleAddAccount(){
      if(vm.showAddAccount) vm.showAddAccount = false
        else vm.showAddAccount = true
      
      console.log(vm.showAddAccount)
    }

    function AddAccountForm(account, userId){
      if (!account) return;
      account.userId = userId;
      console.log(account.accountId)
      clashUserService.getClashUser(account.accountId)
          .then(function(user) {
            console.log(user);
            if(user.data.reason){
              ngDialog.open({
                template: '\
                  <p>cant find clash user with tag: '+ account.accountId +'</p>\
                  <div class=\"ngdialog-buttons\">\
                      <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
                  </div>',
                plain: true
              });
            } else if (user.data.name != account.userName){
              ngDialog.open({
                template: '\
                  <p>The name of this clash user is not '+ account.userName +'</p>\
                  <div class=\"ngdialog-buttons\">\
                      <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
                  </div>',
                plain: true
              });
            }
            else {
              QueryService
                .query('POST', 'accounts/', null, account)
                .then(function(newAccount) {
                  vm.newAccount = newAccount.data.data;
                  console.log(vm.newAccount)
                  $log.debug('newAccount', vm.newAccount);

                  var dialog = ngDialog.open({
                    template: '\
                      <p>New account created</p>\
                      <div class="ngdialog-buttons">\
                          <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'ok\')">OK</button>\
                      </div>',
                    plain: true
                  });

                  // dialog.closePromise.then(function(closedDialog) {
                  //   $state.go('displayAccount', { accountId: vm.newAccount._id });
                  // });

                })
                .catch(function(err) {
                  $log.debug(err);
                });
              
            }
            
            
      })
      
      
    }
  }

})();
