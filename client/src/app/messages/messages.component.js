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

    messagesCtrl.$inject = ['$log', 'usersService', '$rootScope', 'localStorage', '$stateParams', 'messagesService', 'groupsService'];

  function messagesCtrl($log, usersService, $rootScope, localStorage, $stateParams, messagesService, groupsService) {
    // console.log('messages controler')
    var vm = this;
    vm.user = localStorage.get('user');
    console.log(vm.user)
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


      if (userId){
        messagesService.getMessagesByUserID(userId)
        .then((messages)=>{
          console.log(messages)
          vm.userMessages = messages.data.data;
          console.log(vm.userMessages)
        })
        .catch(function(err) {
          $log.debug(err);
        });

        groupsService.getGroupsByUserID(userId)
          .then((groups) => {
            vm.groups = groups.data.data
          })
      
      
      } else {
        messagesService.getAllMessagesFromDataBase()
          .then((messages) => {
            vm.messages = messages.data.data;
            console.log(vm.messages)
            $log.debug('messages', vm.messages);
          })
          .catch(function(err) {
            $log.debug(err);
          });

        groupsService.getAllGroupsFromDataBase(userId)
        .then((groups) => {
          vm.groups = groups.data.data
        })

        usersService.getAllUsers()
          .then((users) => {
            vm.users = users.data.daya
          })
        

      }
    };

    
  }

})();
