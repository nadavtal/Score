;(function() {

  'use strict';

  angular
    .module('boilerplate')
    .component('user', {
      bindings: {
        userId: '<'
      },
      templateUrl: 'app/user/newUserComponent.html',
      controllerAs: 'vm',
      controller: UserCtrl
    });

  UserCtrl.$inject = ['$log', '$state', '$stateParams', 'QueryService', 'localStorage', 'platformService', 'accountsService', 
    'ngDialog', '$rootScope', '$scope', 'clashUserService', 'gamesService','usersService', 'groupsService','friendsService', 'utils'];

  function UserCtrl($log, $state, $stateParams, QueryService, localStorage, platformService, accountsService, 
      ngDialog, $rootScope, $scope, clashUserService, gamesService, usersService, groupsService, friendsService, utils) {
    var vm = this;
    
    
    
    // methods
    vm.createUser = createUser;
    vm.editUser = editUser;
    vm.submitUserForm = submitUserForm;
    vm.changeActiveTab = changeActiveTab;
    
    
    vm.sendMessageToUser = sendMessageToUser;
    vm.inviteUserToGroup = inviteUserToGroup;
    vm.inviteUserToGame  = inviteUserToGame;
    vm.sendFriendRequest = sendFriendRequest;
    vm.backToMain = backToMain;
    vm.addToFriends = addToFriends;
    vm.removeFromFriends = removeFromFriends
    
    
    $scope.$on('user:login', function() {
      vm.currentUser = localStorage.get('user');
      $rootScope.user = vm.user;
      console.log('user from logging in', vm.user)
      
    });
    vm.$onInit = function() {
      vm.showMenuTab = false
      
      
      vm.showAddAccount = false;
      var userId = vm.userId || $stateParams.userId;
      var state = $state.current.name;
      
      vm.loading = false;
      vm.currentUser = localStorage.get('user');
      vm.user = vm.user || {};
      vm.activeTab = '';
      vm.isUser = false;
      vm.areFriends = false;
      vm.userLoaded = false;
      vm.background_color = 'black'

      var colorPerActiveTab = {
        myProfile : 'green',
        accounts : 'orange',
        groups : 'blue',
        friends : 'purple',
        games : 'black',
        messages : 'pink',
        
      }

      if(state == 'createUser'){
        vm.changeActiveTab('myProfile');
      }
      // if(localStorage.get('activeTab')){
      //   vm.changeActiveTab(localStorage.get('activeTab'))
      //   console.log(vm.activeTab)
      // }

      
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

      setActionType(state, userId);

      
      if(userId){
        // console.log('getting user', userId)
        usersService.getUser(userId)
          .then(function(user) {
          vm.user = user.data.data;
          // console.log(vm.user);
          vm.userLoaded = true;
          $log.debug('user', vm.user);

          if(vm.currentUser._id == vm.user._id){
            vm.isUser = true
          }
          if(!vm.isUser){
            vm.areFriends = friendsService.checkIfFriends(vm.currentUser, vm.user)
          }
          console.log('areFriends: ', vm.areFriends)
          
          gamesService.getGamesByUserID(userId)
            .then((games)=>{
              console.log(games)
              vm.userGames = games.data.data;
              console.log(vm.userGames)
            })
            .catch(function(err) {
              $log.debug(err);
            });

          
        })
      }
        
          

       
    };

    

   
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

    function backToMain(){
      console.log('backto main')
      vm.activeTab = '';
      localStorage.remove('activeTab');
      vm.showMenuTab = false;
      $('.userContent').css('top', '100vh')
      $('.userContentWrapper').css({
        'opacity': 0,
          'height' : 0})
    }

    function changeActiveTab(tab){
      // console.log(tab);
      vm.showMenuTab = true;

      vm.activeTab = tab;
      if(tab == 'myProfile') vm.background_color = 'green'
      else if(tab == 'accounts') vm.background_color = 'orange'
      else if(tab == 'groups') vm.background_color = 'blue'
      else if(tab == 'friends') vm.background_color = 'purple'
      else if(tab == 'games') vm.background_color = 'black'
      else if(tab == 'messages') vm.background_color = 'pink'


      // switch (vm.activeTab) {
      //   case 'myProfile':
      //     vm.background_color = 'green'
      //   case 'accounts':
      //     vm.background_color = 'orange'
      //   case 'groups':
      //     vm.background_color = 'blue'
      //   case 'friends':
      //     vm.background_color = 'purple'
      //   case 'games':
      //     vm.background_color = 'black'
      //   case 'messages':
      //     vm.background_color = 'pink'
        
      // }
      
      // console.log(vm.background_color)
      // $('.userContent').css('top', '5rem')
      
      // $('.userContentWrapper').css({
      //                           'opacity': 1,
      //                             // 'height' : 'auto'
      //                           })
      
      // $('.cubeMenuItem--iconSmall').on('click', function(){
      //   // $(this).css('transform', 'rotateY(180deg)')
      // })
      localStorage.update('activeTab', vm.activeTab);
      
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

      usersService.createUser(user)
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

    

    function editUser(user, userId) {
      if (!user) return;
      console.log('user before update', user);
      usersService.editUser(user, userId)
        .then(function(updatedUser) {
          console.log(updatedUser);
          var updatedUser = updatedUser.data.data;
          console.log('updatedUser', updatedUser);

          $log.debug('updatedUser', updatedUser);
          

           
          // Swal.fire(updatedUser.userName +' Update successful!');
          
          Swal.fire({
            position: 'center',
            type: 'success',
            title: updatedUser.userName +' Update successful!',
            showConfirmButton: false,
            timer: 1500
          })
          // ngDialog.open({
          //   template: '\
          //     <p>'+ updatedUser.userName +'Update successful!</p>\
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


    function sendMessageToUser(){
      // console.log(vm.currentUser, vm.user)
      var users = {
        sender: vm.currentUser,
        receiver: vm.user,
        messageType: 'chatMessage'
      }
      var dialog = ngDialog.open({
        template: '\
          <message-form-directive></message-form-directive>',
        plain: true,
        data: users
      });
    }

    function inviteUserToGroup(){
      console.log(vm.currentUser, vm.user)
      groupsService.getGroupsByUserID(vm.currentUser._id)
        .then((groups)=>{
          var users = {
            sender: vm.currentUser,
            receiver: vm.user,
            messageType: 'groupInvite',
            groups: groups.data.data
          }
          var dialog = ngDialog.open({
            template: '\
              <message-form-directive></message-form-directive>',
            plain: true,
            data: users
          });
        })
      
    }

    function sendFriendRequest(){
      console.log(vm.currentUser, vm.user)
      var users = {
        sender: vm.currentUser,
        receiver: vm.user,
        messageType: 'friendRequest'
      }
      var dialog = ngDialog.open({
        template: '\
          <message-form-directive></message-form-directive>',
        plain: true,
        data: users
      });
    }

    function inviteUserToGame(){
      console.log(vm.currentUser, vm.user)
      var users = {
        sender: vm.currentUser,
        receiver: vm.user,
        messageType: 'gameInvite'
      }
      var dialog = ngDialog.open({
        template: '\
          <message-form-directive></message-form-directive>',
        plain: true,
        data: users
      });
    }

    function addToFriends(userToAdd, targetUser){
      console.log('userToAdd: ', userToAdd);
      console.log('add to: ', targetUser);
      if(!userToAdd) return;
      if(!targetUser) return;

      if(targetUser.friends){
        targetUser.friends.push({
          userName :userToAdd.userName,
          userId: userToAdd._id
        })

      } else{
        targetUser.friends = [];
        targetUser.friends.push({
          userName :userToAdd.userName,
          userId: userToAdd._id
        })

      }
      if(userToAdd.friends){
        userToAdd.friends.push({
          userName :targetUser.userName,
          userId: targetUser._id
        })

      } else{
        userToAdd.friends = [];
        userToAdd.friends.push({
          userName :targetUser.userName,
          userId: targetUser._id
        })

      }

      // console.log(userToAdd)
      // console.log(targetUser)
      editUser(userToAdd, userToAdd._id);
      editUser(targetUser, targetUser._id);
      localStorage.update('user', targetUser);
      vm.currentUser = targetUser
    }

    function removeFromFriends(userToRemove, targetUser){
      console.log('userToRemove: ', userToRemove);
      console.log('remove from: ', targetUser);
      if(!userToRemove) return 'there is no "userToRemove"';
      if(!targetUser) return 'there is no "targetUser"';
      // console.log(utils.findUserInArrayById(targetUser.friends, userToRemove))
      targetUser.friends = targetUser.friends.filter(function( obj ) {
        return obj.userId !== userToRemove._id;
      }); 
      userToRemove.friends = userToRemove.friends.filter(function( obj ) {
        return obj.userId !== targetUser._id;
      }); 
      // console.log(targetUser.friends)
      // console.log(userToRemove.friends)
      
      editUser(userToRemove, userToRemove._id);
      editUser(targetUser, targetUser._id);
      localStorage.update('user', targetUser);
      vm.currentUser = targetUser
    }

    
    
    

  }

})();
