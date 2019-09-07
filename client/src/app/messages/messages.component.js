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
    $scope.$on('messagesSent', function(event, messages) {
        console.log(event, messages);
        addMessagesToBox(messages)
        console.log(vm.outboxMessages)
        // $scope.$apply();
      
    });
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

    
    vm.getGroupFromListByGroupId = getGroupFromListByGroupId
    
    vm.$onInit = function() {
      
      var userId = vm.userId || $stateParams.userId;
      if (userId){
        usersService.getUser(userId)
        .then((user) => {
          vm.user = user.data.data;
          vm.userMessages = [];
          // console.log(vm.user)
        })
        .catch(function(err) {
          $log.debug(err);
        });

        messagesService.getMessagesByUserID(userId)
        .then((messages)=>{
          // console.log(messages);
          vm.userMessages = messages.data.data;
          vm.inboxMessages = inboxMessages(vm.userMessages);
          vm.outboxMessages = outboxMessages(vm.userMessages);
          vm.replyMessages = replyMessages(vm.userMessages);
          vm.unreadReplies = checkForUnreadReplies(vm.userMessages);
          // addMessagesToArray(vm.unreadReplies, vm.inboxMessages);
          vm.sumUnreadMessages = messagesService.sumUnreadMessages(vm.userMessages);
          // console.log('sumUnreadMessages', vm.sumUnreadMessages);
          // for(var i=0; i<messages.data.data.length; i++){
          //   vm.userMessages.push(messages.data.data[i]);

          // }
          console.log('inbox messages', vm.inboxMessages);
          console.log('outbox messages', vm.outboxMessages);
          console.log('reply messages', vm.replyMessages);
        })
        .catch(function(err) {
          $log.debug(err);
        });

        groupsService.getGroupsByUserID(userId)
          .then((groups) => {
            vm.groups = groups.data.data;
            
            // console.log(vm.groups);
            messagesService.getMessagesFromGroups(vm.groups)
              .then(function(messages){
                console.log('group messages:', messages);
                
                // $scope.$apply();
              });
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
            vm.users = users.data.data
          })
        

      }
    };


    function getGroupFromListByGroupId(groupId){
      console.log(vm.groups);
      groupsService.getGroupFromListByGroupId(vm.groups, groupId);

    }

    function checkForUnreadReplies(messages){
      var unreadReplies = [];
      for( var j=0; j< messages.length; j++){
        for(var i=0; i<messages[j].replies.length; i++){
          console.log(messages[j].replies[i].status);
          if(messages[j].replies[i].status == 'unread'){
            unreadReplies.push(messages[j]);
            break
            console.log(messages[j]);
          }
        }
        
      }
      // console.log(unreadReplies)
      return unreadReplies
    }

    function inboxMessages(messages){
      var inboxMessages = [];
      for(var i=0; i< messages.length; i++){
        if(messages[i].receiver.userId == vm.user._id){
          inboxMessages.push(messages[i])
        }
      }
      return inboxMessages
    }

    function addMessagesToBox(messages){
      for(var i=0; i< messages.length; i++){
        if(messages[i].sender.userId == vm.user._id){
          vm.outboxMessages.push(messages[i])
        } else if(messages[i].receiver.userId == vm.user._id){
          vm.inboxMessages.push(messages[i])
        }
      }
      
    }
    function outboxMessages(messages){
      var outboxMessages = [];
      for(var i=0; i< messages.length; i++){
        if(messages[i].sender.userId == vm.user._id){
          outboxMessages.push(messages[i])
        }
      }
      return outboxMessages
    }

    function replyMessages(messages){
      var replyMessages = [];
      for(var i=0; i< messages.length; i++){
        console.log(messages[i])
        if(messages[i].messageType == 'replyMessage'){
          replyMessages.push(messages[i]);
          console.log(replyMessages)
        }
      }
      return replyMessages
    }

    

    function addMessages(messages, targetArray){
      console.log(messages)
      for(var i=0; i< messages.length; i++){
        for(var j=0; j< messages[i].length; j++){
          targetArray.push(messages[i][j]);
        }
      }
      
    }

    function addMessagesToArray(messages, targetArray){
      console.log(messages);
      for(var i=0; i< messages.length; i++){
        let inArray = false;
        for(var j=0; j< targetArray.length; j++){
          if(messages[i]._id == targetArray[j]._id){
            inArray = true;
            console.log('message allready in array')
          } 

        }
        if(!inArray) targetArray.push(messages[i]);
        
      }
      
    }

    

    
    
  }

})();
