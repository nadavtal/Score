;(function() {

  'use strict';

  angular
    .module('boilerplate')
    .component('user', {
      bindings: {
        userId: '<'
      },
      templateUrl: 'app/user/user.html',
      controllerAs: 'vm',
      controller: UserCtrl
    });

  UserCtrl.$inject = ['$log', '$state', '$stateParams', 'QueryService', 'localStorage', 'platformService', 'accountsService', 
    'ngDialog', '$rootScope', '$scope', 'clashUserService', 'gamesService'];

  function UserCtrl($log, $state, $stateParams, QueryService, localStorage, platformService, accountsService, 
      ngDialog, $rootScope, $scope, clashUserService, gamesService) {
    var vm = this;
    
    
    
    // methods
    vm.createUser = createUser;
    vm.editUser = editUser;
    vm.submitUserForm = submitUserForm;
    vm.changeActiveTab = changeActiveTab;
    vm.AddAccountForm = AddAccountForm
    vm.toggleAddAccount = toggleAddAccount
    
    vm.$onInit = function() {

      vm.showAddAccount = false
      
      if(!$rootScope.platforms) {
        platformService.getAllPlatformsFromDataBase()
        .then((platforms) => {
          console.log(platforms)
          $rootScope.platforms = platforms.data.data;
          vm.platforms = $rootScope.platforms
         
        })
      } else{
        vm.platforms = $rootScope.platforms
      }

      
      
      var userId = vm.userId || $stateParams.userId;
      var state = $state.current.name;
      vm.currentUser = localStorage.get('user');
      vm.user = vm.user || {};
      vm.activeTab = 'info'

      setActionType(state, userId);

      if (userId)
        console.log('getting user', userId)
        getUser(userId)
         .then(function(user) {
          vm.user = user.data.data;
          console.log(vm.user);
          
          $log.debug('user', vm.user);

          accountsService.getAccountsByUserID(vm.user._id)
            .then((accounts) => {
             
              vm.accounts = accounts.data.data;
              console.log(vm.accounts)
            })
          })
          .catch(function(err) {
            $log.debug(err);
          });
          gamesService.getGamesByUserID(userId)
            .then((games)=>{
              console.log(games)
              vm.userGames = games.data.data;
              console.log(vm.userGames)
            })

       
    };

    function toggleAddAccount(){
      if(vm.showAddAccount) vm.showAddAccount = false
        else vm.showAddAccount = true
      
      console.log(vm.showAddAccount)
    }

    function changeActiveTab(tab){
      vm.activeTab = tab;
      
    }

    
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

    function findItemById(array, id){
      console.log(id)
      for (let item of array) {
        console.log(item._id)
        if(item._id == id) {
          
          var foundItem = item
        }
      }

      return foundItem
    }

    /// definitions
    $rootScope.$on('selectNewWinner', function(event, oldWinner, newWinner) {
      // console.log('selectNewWinnerEvent', event)
      console.log('select New Winner in user component', oldWinner, newWinner)
      oldWinner = findItemById($rootScope.users, oldWinner.userid);
      newWinner = findItemById($rootScope.users, newWinner.userid);
      console.log('select New Winner in user component', oldWinner, newWinner)
      newWinner.wins += 1;
      oldWinner.wins -= 1;
      console.log('selectNewWinner after incrementing ', oldWinner, newWinner)
      editUser(newWinner, newWinner.userid);
      editUser(oldWinner, oldWinner.userid);
    });

    $rootScope.$on('selectWinner', function(event, newWinner) {
      console.log('selectWinnerEvent in user controller', event)
      console.log('selectWinnerData in user controller',newWinner)
      newWinner = findItemById($rootScope.users, newWinner.userid);
      newWinner.wins += 1;
     
      editUser(newWinner, newWinner._id);
      
    });
    /**
     * Set action type
     */
    function setActionType(state, userId) {
      if (state == 'editUser')
        vm.actionType = 'editUser';
      else if (!userId && state != 'editUser')
        vm.actionType = 'createUser';
      else
        vm.actionType = 'loadUser';

      return vm.actionType;
    }


    /**
     * Submit form: either create or edit user
     */
    function submitUserForm(user, userId) {
      console.log(user, userId)
      vm[vm.actionType](user, userId);
    }

    /**
     * Create new user
     * @param  {object} user User form
     * @return {object}      Promise
     */
    function createUser(user) {
      if (!user) return;

      QueryService
        .query('POST', 'users/', null, user)
        .then(function(newUser) {
          vm.newUser = newUser.data.data;
          $log.debug('newUser', vm.newUser);

          var dialog = ngDialog.open({
            template: '\
              <p>New user created</p>\
              <div class="ngdialog-buttons">\
                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'ok\')">OK</button>\
              </div>',
            plain: true
          });

          dialog.closePromise.then(function(closedDialog) {
            $state.go('displayUser', { userId: vm.newUser._id });
          });

        })
        .catch(function(err) {
          $log.debug(err);
        });
    }

    /**
     * Update user attributes
     * @param  {object} editUser User form
     * @return {object}            Promise
     */

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

    function editUser(user, userId) {
      if (!user) return;
      console.log('user before update', user);
      QueryService
        .query('PUT', 'users/' + userId, null, user)
        .then(function(updatedUser) {
          console.log(updatedUser);
          var updatedUser = updatedUser.data.data;
          console.log('updatedUser', updatedUser);
          $log.debug('updatedUser', updatedUser);


          getUsers();

          // for(i = 0; i<$rootScope.users.length; i++){
          //   console.log($rootScope.users[i])
          //   if($rootScope.users[i]._id == updatedItem._id){
          //     console.log('foundItem', $rootScope.users[i], updatedItem)
          //     array[i] = updatedItem
          //   }
          // }
          // utils.replaceOldItemWithUpdated($rootScope.users, updatedUser)

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

    /**
     * Get user
     * @param  {object} userId User ID
     * @return {object}      Promise
     */
    function getUser(userId) {
      if (!userId) return;

      return QueryService
        .query('GET', 'users/' + userId, null, null)
        
    }

  }

})();
