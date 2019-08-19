;(function() {

  'use strict';

  angular
    .module('boilerplate')
    .component('group', {
      bindings: {
        groupId: '<'
      },
      templateUrl: 'app/group/group.html',
      controllerAs: 'vm',
      controller: GroupCtrl
    });

  GroupCtrl.$inject = ['$log', '$state', '$stateParams', 'QueryService', 'localStorage', 'groupsService', 'usersService',
    'ngDialog', '$rootScope', '$scope', 'gamesService', '$element'];

  function GroupCtrl($log, $state, $stateParams, QueryService, localStorage, groupsService, usersService, 
      ngDialog, $rootScope, $scope, gamesService, $element) {
    var vm = this;

    // methods
    vm.createGroup = createGroup;
    vm.editGroup = editGroup;
    vm.submitGroupForm = submitGroupForm;
    vm.registerToGroup = registerToGroup;
    vm.unRegisterToGroup = unRegisterToGroup;
    vm.selectManager = selectManager;
    vm.changeActiveTab = changeActiveTab;
    vm.clearSearchTerm = clearSearchTerm 
     
    vm.$onInit = function() {
      var groupId = vm.groupId || $stateParams.groupId;
      
      var state = $state.current.name;
      vm.user = localStorage.get('user') || {};
      vm.registerd = false;
      vm.activeTab = 'info'
      vm.searchTerm;
      vm.showBottomToolBar = false;
      if(!$rootScope.users){
        console.log('no rootscope users');
        usersService.getAllUsers()
        .then(function(user) {
          $rootScope.users = user.data.data;;
          
          vm.users = $rootScope.users
          // console.log(vm.users)
        })
        .catch(function(err) {
          $log.debug(err);
        });;
        
      } else{
        vm.users = $rootScope.users;
        // console.log('vm.users in group', vm.users);
      }

      vm.actionType = setActionType(state, groupId);
      
      if (groupId){
        groupsService.getGroup(groupId)
        .then(function(group) {
          
          vm.group = group.data.data;
          localStorage.set('group', vm.group)
          console.log('group', vm.group);
          vm.showBottomToolBar = true;
          vm.registerd = checkIfRegistered();
          console.log(vm.registerd)
          $log.debug('group', vm.group);
          gamesService.getGamesByGroupId(groupId)
            .then((games)=>{
              vm.games = games.data.data;
              console.log(vm.games)
            })
        })
        .catch(function(err) {
          $log.debug(err);
        });;

      }
      else {
        vm.group = {};
        vm.group.members = [{userName: vm.user.userName,
                              userId : vm.user._id}]
        vm.group.groupManager = {userName: vm.user.userName,
                                userId : vm.user._id}
        vm.groupManager = vm.group.groupManager;
        vm.showBottomToolBar = true;
      }
      $element.find('input').on('keydown', function(ev) {
        console.log(ev)
        // ev.stopPropagation();
      });
        
      
    };
    /**
     * Submit form: either create or edit user
     */
    function clearSearchTerm() {
      vm.searchTerm = '';
    };

    function changeActiveTab(tab){
      vm.activeTab = tab
    } 
    function submitGroupForm(group, groupId) {
      // console.log(group, groupId)
      vm[vm.actionType](group, groupId);
    }

    

    function checkIfRegistered(){
      
      var registerd = checkIfUserInArrayByUsername(vm.group.members, vm.user.userName)
      console.log(registerd)
      if (registerd) return true
      else return false
      
    }
    function setActionType(state, groupId) {
      // console.log(state)
      if (state == 'editGroup')
        vm.actionType = 'editGroup';
      else if (state == 'displayGroup')
        vm.actionType = 'displayGroup';
      else if (state == 'createGroup')
        vm.actionType = 'createGroup';
      else if (state == 'registerToGroup')
        vm.actionType = 'registerToGroup';
      else
        vm.actionType = 'loadGroup';
      console.log('actionType: ', vm.actionType);
      return vm.actionType;
    }

    function selectManager(user){
      
      console.log('selecting new manager', user)
      vm.group.groupManager = {
        userName : user.userName,
        userId : user._id
      }
      // console.log(vm.group)
    }

     /**
     * Create new user
     * @param  {object} user User form
     * @return {object}      Promise
     */
    function createGroup(group) {
      console.log(group)
      if (!group) return;
      group.groupManager = vm.groupManager
      console.log(group.groupManager)
      QueryService
        .query('POST', 'groups/', null, group)
        .then(function(newGroup) {
          console.log(newGroup)
          var newGroup = newGroup.data.data;
          $log.debug('newGroup', newGroup);

          var dialog = ngDialog.open({
            template: '\
              <p>New group created</p>\
              <div class="ngdialog-buttons">\
                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'ok\')">OK</button>\
              </div>',
            plain: true
          });

          dialog.closePromise.then(function(closedDialog) {
            $state.go('displayGroup', { groupId: newGroup._id });
          });

        })
        .catch(function(err) {
          $log.debug(err);
        });
    }

    /**
     * Update group attributes
     * @param  {object} editGroup Group form
     * @return {object}            Promise
     */
    
    

    function editGroup(group, groupId, responseMessage) {
      console.log(group)
      if (!group) return;
      if(vm.groupManager && group.groupManager){
        if(vm.groupManager.userId != group.groupManager.userId){
          console.log('manager has been changed ', group.groupManager, 'vm.newManger:' + vm.groupManager);
          $scope.$emit('selectNewManager', group.groupManager, vm.groupManager);
          group.groupManager = vm.groupManager;
        }
      }
      
      if(vm.groupManager && !group.groupManager){
        console.log('manager has been declared ');
        $scope.$emit('selectManager', vm.groupManager);
        // group.groupManager = vm.groupManager;
      }
     
      QueryService
        .query('PUT', 'groups/' + groupId, null, group)
        .then(function(updatedGroup) {
          // checkIfRegistered()


          var updatedGroup = updatedGroup.data.data;
          
          vm.group = updatedGroup;
          // $scope.$apply();
          console.log(vm.group)
          $log.debug('updatedGroup', vm.group);
          if(!responseMessage)
            var responseMessage = 'group Updated'
          Swal.fire({
            position: 'center',
            type: 'success',
            title: responseMessage,
            showConfirmButton: false,
            timer: 1500
          })
          // ngDialog.open({
          //   template: '\
          //     <p>'+responseMessage+'</p>\
          //     <div class=\"ngdialog-buttons\">\
          //         <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
          //     </div>',
          //   plain: true
          // });

          

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
    

    vm.addPlayer = function(user){
      console.log(user);
      var registerd = checkIfUserInArrayByUsername(vm.group.members, user.userName);
      console.log(registerd)
      if(registerd){
        ngDialog.open({
          template: '\
            <p>'+ user.userName+' is allready registered to this group</p>\
            <div class=\"ngdialog-buttons\">\
                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
            </div>',
          plain: true
        });
      } else{
        vm.group.members.push({userName: user.userName,
                               userId: user._id})
      }
      
        
        console.log(vm.group)
      }

    vm.removePlayer = function(index){
      
      vm.group.members.splice(index, 1);
      console.log(vm.group.players)
    }

    function registerToGroup() {
      
      if (!vm.group) return;

      var registerd = checkIfUserInArrayByUsername(vm.group.members, vm.user.username);
     
      

      if (registerd) {
        ngDialog.open({
          template: '\
            <p>You are allready registered to this group</p>\
            <div class=\"ngdialog-buttons\">\
                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
            </div>',
          plain: true
        });
      }
      else {
        vm.group.members.push(vm.user)
        console.log(vm.user);
        editGroup(vm.group, vm.group._id, 'registered to '+ vm.group.groupName);
      }
      
      
    }

    function unRegisterToGroup() {
      
      if (!vm.group) return;
      if(vm.group.groupManager.userName == vm.user.userName){
        ngDialog.open({
          template: '\
            <p>A manager cant leave group without changing to another manager</p>\
            <div class=\"ngdialog-buttons\">\
                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
            </div>',
          plain: true
        });
      }else{
        vm.group.members = vm.group.members.filter(function(value){
        
          return value.username != vm.user.username;
      
        });
     
        editGroup(vm.group, vm.group._id, 'Unregistered '+ vm.user.username +' from '+ vm.group.grouptype + ' at ' + vm.group.host)
      }
      
      
    }

    

    

    function checkIfUserInArrayByUsername(array, username){
       console.log(array, username)
      
      for (var i=0; i < array.length; i++) {
        
        if(array[i].userName == username){
          var foundUser = array[i]
        }
      }
      return foundUser
    }

    function checkIfUserInArrayById(array, id){
       
      
      for (var i=0; i < array.length; i++) {
        
        if(array[i]._id == id){
          var foundUser = array[i]
        }
      }
      return foundUser
    }

    

    
    

  }

})();
