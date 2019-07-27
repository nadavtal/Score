;(function() {
 
  'use strict';

  /**
   * Show user list table
   *
   * @usage <user-list users="vm.games"></user-list>
   */

  angular
    .module('boilerplate')
    .component('messages', {
      bindings: {
        games: '<'
      },
      templateUrl: 'app/messages/messages.html',
      controllerAs: 'vm',
      controller: messagesCtrl
    });

    messagesCtrl.$inject = ['$log', 'QueryService', '$rootScope', 'localStorage', '$stateParams'];

  function messagesCtrl($log, QueryService, $rootScope, localStorage, $stateParams) {
    // console.log('messages controler')
    var vm = this;
    vm.user = localStorage.get('user');
    vm.data = {
      selectedIndex: 0,
      
      bottom:        false
    };
    vm.next = function() {
      vm.data.selectedIndex = Math.min(vm.data.selectedIndex + 1, 2) ;
    };
    vm.previous = function() {
      vm.data.selectedIndex = Math.max(vm.data.selectedIndex - 1, 0);
    };
    
    vm.$onInit = function() {

      var userId = vm.userId || $stateParams.userId;
      var messageId = vm.messageId || $stateParams.messageId;
      // console.log('userId: ' + userId, 'messageId: '+messageId);


      if (userId)
        getMessagesByUserId(userId);
      
      
      else 
      getMessages();
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
    function getMessages() {
      QueryService
        .query('GET', 'messages/', null, null)
        .then(function(messages) {
          // console.log(game)
          vm.messages = messages.data.data;
          console.log(vm.messages)
          $log.debug('messages', vm.messages);
        })
        .catch(function(err) {
          $log.debug(err);
        });
    }

    function getMessagesByUserId(userId) {
      // console.log(userId)
      QueryService
        .query('GET', 'users/'+userId + '/messages', null, null)
        .then(function(messages) {
          console.log(messages)
          
          vm.messages = messages.data.data;
          console.log(vm.messages)
          $log.debug('messages', vm.messages);
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
