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

    messagesCtrl.$inject = ['$log', 'usersService', '$scope', '$rootScope', 'localStorage', '$stateParams', 'messagesService', 'groupsService'];

  function messagesCtrl($log, usersService, $scope, $rootScope, localStorage, $stateParams, messagesService, groupsService) {
    
    var vm = this;
    vm.currentUser = localStorage.get('user');
    console.log(vm.currentUser)
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

    vm.messageClicked = messageClicked;
    
    vm.$onInit = function() {
      
      var userId = vm.userId || $stateParams.userId;
      if (userId){
        usersService.getUser(userId)
        .then((user) => {
          vm.user = user.data.data;
          vm.userMessages = [];
          // console.log(vm.user)
        });
        messagesService.getMessagesByUserID(userId)
        .then((messages)=>{
          console.log(messages);
          vm.userMessages = messages.data.data
          vm.sumUnreadMessages = messagesService.sumUnreadMessages(vm.userMessages);
          console.log('sumUnreadMessages', vm.sumUnreadMessages);
          // for(var i=0; i<messages.data.data.length; i++){
          //   vm.userMessages.push(messages.data.data[i]);

          // }
          console.log(vm.userMessages)
        })
        .catch(function(err) {
          $log.debug(err);
        });

        // groupsService.getGroupsByUserID(userId)
        //   .then((groups) => {
        //     vm.groups = groups.data.data;
        //     // console.log(vm.groups);
        //     messagesService.getMessagesFromGroups(vm.groups)
        //       .then(function(messages){
        //         console.log(messages[0].length);
        //         for(var i=0; i<messages[0].length; i++){
        //           console.log(messages[0][i]);
        //           vm.userMessages.push(messages[0][i]);
      
        //         }
        //         console.log(vm.userMessages);
        //         // $scope.$apply();
        //       });
        //   })
      
      
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
            vm.users = users.data.data
          })
        

      }
    };

    function messageClicked(event,message, box){
      console.log(box);
      console.log(event.currentTarget.parentElement.children[1])
      var content = angular.element(event.currentTarget.parentElement.children[1]);
      console.log(content);
      content.toggleClass('hidden');
      if(box == 'inbox'){
        changeMessageStatus(message, 'read')

      }
      
    }

    function changeMessageStatus(message, newStatus){
      if (message.status == 'unread'){
        message.status = newStatus;
        
        messagesService.updateMessage(message)
          .then(function(message){
            $rootScope.sumUnreadMessages -= 1;
            // console.log($scope.$parent.$parent.$parent.vm.sumUnreadMessages);
            $scope.$parent.$parent.$parent.vm.sumUnreadMessages -= 1;
            
          })
      }

    }

    
    
  }

})();
