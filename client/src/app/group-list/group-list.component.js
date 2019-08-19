;(function() {
 
  'use strict';

  /**
   * Show user list table
   *
   * @usage <user-list users="vm.games"></user-list>
   */

  angular
    .module('boilerplate')
    .component('groupList', {
      bindings: {
        games: '<'
      },
      templateUrl: 'app/group-list/group-list.html',
      controllerAs: 'vm',
      controller: GroupListCtrl
    });

    GroupListCtrl.$inject = ['$log', 'QueryService', 'usersService', 'localStorage', '$stateParams', 'groupsService', 'ngDialog'];

  function GroupListCtrl($log, QueryService, usersService, localStorage, $stateParams, groupsService, ngDialog) {
    // console.log('groupList component')
    var vm = this;
    vm.sendMessageToGroup = sendMessageToGroup
    
    
    vm.$onInit = function() {

      var userId = vm.userId || $stateParams.userId;
      var groupId = vm.groupId || $stateParams.groupId;
      // console.log('userId: ' + userId, 'groupId: '+groupId);
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
          getGroupsByUserId(userId);
        })
      
      }
       
      
      else 
      groupsService.getAllGroupsFromDataBase()
      .then(function(groups) {
        // console.log(game)
        vm.groups = groups.data.data;
        console.log(vm.groups)
        $log.debug('groups', vm.groups);
      })
      .catch(function(err) {
        $log.debug(err);
      });;
    };

    

    vm.removeGame = function(index, gameId){
      QueryService
        .query('POST', 'games/'+ gameId, null, null)
        .then(function(deletedgame) {
          console.log('deletedgame', deletedgame)
          vm.games.splice(index,1)
        })
      
    }

    function getGroupsByUserId(userId) {
      groupsService.getGroupsByUserID(userId)
      .then(function(groups) {
        // console.log(groups)
        
        vm.groups = groups.data.data;
        console.log('groups', vm.groups)
        $log.debug('groups', vm.groups);
      })
      .catch(function(err) {
        $log.debug(err);
      });
      // console.log(userId)
      
        
    }

    function sendMessageToGroup(group){
      var data = {
        sender: vm.currentUser,
        group: group,
        messageType : 'groupMessage',
        groups: vm.groups
      }
      var dialog = ngDialog.open({
        template: '\
          <message-form-directive></message-form-directive>',
        plain: true,
        data: data
      });
      // for (let member of group.memnbers){
        
      // }
    }

    function sendMessageToUser(user){
      console.log(vm.currentUser, user)
      user._id = user.userId
      var users = {
        sender: vm.currentUser,
        receiver: user,
        messageType: 'chatMessage'
      }
      var dialog = ngDialog.open({
        template: '\
          <message-form-directive></message-form-directive>',
        plain: true,
        data: users
      });
    }

    
  }

})();
