;(function() {
 
  'use strict';

  /**
   * Show user list table
   *
   * @usage <user-list users="vm.games"></user-list>
   */

  angular
    .module('boilerplate')
    .component('accountList', {
      bindings: {
        games: '<'
      },
      templateUrl: 'app/account-list/account-list.html',
      controllerAs: 'vm',
      controller: accountListCtrl
    });

    accountListCtrl.$inject = ['$log', 'QueryService', '$rootScope', 'localStorage', '$stateParams'];

  function accountListCtrl($log, QueryService, $rootScope, localStorage, $stateParams) {
    // console.log('accountList component')
    var vm = this;
    vm.user = localStorage.get('user');
    
    
    vm.$onInit = function() {

      var userId = vm.user._d || $stateParams.userId;
      var groupId = vm.groupId || $stateParams.groupId;
      // console.log('userId: ' + userId, 'groupId: '+groupId);


      if (userId)
        getGroupsByUserId(userId);
      
      
      else 
      getGroups();
    };

    

    vm.removeGame = function(index, gameId){
      QueryService
        .query('POST', 'games/'+ gameId, null, null)
        .then(function(deletedgame) {
          console.log('deletedgame', deletedgame)
          vm.games.splice(index,1)
        })
      
    }

    /// definitions

    /**
     * Get users
     */
    function getGroups() {
      QueryService
        .query('GET', 'groups/', null, null)
        .then(function(groups) {
          // console.log(game)
          vm.groups = groups.data.data;
          console.log(vm.groups)
          $log.debug('groups', vm.groups);
        })
        .catch(function(err) {
          $log.debug(err);
        });
    }

    function getGroupsByUserId(userId) {
      // console.log(userId)
      QueryService
        .query('GET', 'users/'+userId + '/groups', null, null)
        .then(function(groups) {
          console.log(groups)
          
          vm.groups = groups.data.data;
          console.log(vm.groups)
          $log.debug('groups', vm.groups);
        })
        .catch(function(err) {
          $log.debug(err);
        });
    }

    function getGamesOfUserId() {
      console.log($stateParams.userId)
      QueryService
        .query('GET', 'games/user/'+$stateParams.userId, null, null)
        
        .then(function(data) {
          console.log(data)
          
        })
        .catch(function(err) {
          $log.debug(err);
        });
    }
  }

})();
