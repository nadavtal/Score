;(function() {
 
  'use strict';

  /**
   * Show user list table
   *
   * @usage <user-list users="vm.games"></user-list>
   */

  angular
    .module('boilerplate')
    .component('accountsList', {
      bindings: {
        accounts: '<'
      },
      templateUrl: 'app/account-list/account-list.html',
      controllerAs: 'vm',
      controller: accountsListCtrl
    });

    accountsListCtrl.$inject = ['$log', 'QueryService', '$rootScope', 'localStorage', '$stateParams', 'accountsService', 'platformService', 'clashUserService', 'ngDialog'];

  function accountsListCtrl($log, QueryService, $rootScope, localStorage, $stateParams, accountsService, platformService, clashUserService, ngDialog) {
    // console.log('accountsList component')
    var vm = this;
    vm.user = localStorage.get('user');
    vm.toggleAddAccount = toggleAddAccount;
    vm.createNewAccount = createNewAccount
    // vm.AddAccountForm = AddAccountForm;
    vm.$onInit = function() {

      var userId = $stateParams.userId;
      console.log(userId)
      if(userId){
        accountsService.getAccountsByUserID(userId)
        .then(function(accounts) {
          // console.log(game)
          vm.accounts = accounts.data.data;
          console.log(vm.accounts)
          $log.debug('accounts', vm.accounts);
        })
        .catch(function(err) {
          $log.debug(err);
        });
      }

      if(!$rootScope.platforms) {
        platformService.getAllPlatformsFromDataBase()
        .then((platforms) => {
          console.log(platforms)
          $rootScope.platforms = platforms.data.data;
          vm.platforms = $rootScope.platforms
         
        })
      } else{
        vm.platforms = $rootScope.platforms
      };
    };

    

    vm.removeAccount = function(index, gameId){
      QueryService
        .query('POST', 'accounts/'+ accountId, null, null)
        .then(function(deletedaccount) {
          console.log('deletedaccount', deletedaccount)
          vm.accounts.splice(index,1)
        })
      
    }

    function createNewAccount(){
      var data = {
        platforms: vm.platforms,
        userId: vm.user._id
      }
      var dialog = ngDialog.open({
        template: '\
          <add-account-directive></add-account-directive>',
        plain: true,
        data: data
      });
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

    /// definitions

  }

})();
