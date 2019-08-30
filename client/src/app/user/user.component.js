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

  UserCtrl.$inject = ['$log', '$state', '$stateParams', 'tournamentsService', 'localStorage', 'platformService', 'accountsService', 
    'ngDialog', '$rootScope', '$scope', 'clashUserService', 'gamesService','usersService', 'groupsService','friendsService', 'Upload', 'messagesService'];

  function UserCtrl($log, $state, $stateParams, tournamentsService, localStorage, platformService, accountsService, 
      ngDialog, $rootScope, $scope, clashUserService, gamesService, usersService, groupsService, friendsService, Upload, messagesService) {
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
    vm.removeFromFriends = removeFromFriends;
    vm.upload = upload;
    
    
    $scope.$on('user:login', function() {
      vm.currentUser = localStorage.get('user');
      $rootScope.user = vm.user;
      console.log('user from logging in', vm.user)
      
    });
    vm.$onInit = function() {
      
      
      if(localStorage.get('activeTab')){
        vm.activeTab = localStorage.get('activeTab');
        vm.showMenuTab = true;
      } else{
        vm.activeTab = '';
        vm.showMenuTab = false;
      }
      vm.showAddAccount = false;
      var userId = vm.userId || $stateParams.userId;
      var state = $state.current.name;
      
      vm.loading = false;
      vm.currentUser = localStorage.get('user');
      vm.user = vm.user || {};
      
      vm.isUser = false;
      vm.areFriends = false;
      vm.userLoaded = false;
      vm.background_color = 'black';
      
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
            console.log('areFriends: ', vm.areFriends);
            // console.log(userId)
            usersService.getFilesByUserId(userId)
              .then(files => {
                vm.files = files.data.data;
                console.log(vm.files)
              });
            messagesService.getMessagesByUserID(userId)
              .then((messages)=>{
                console.log(messages);
                vm.userMessages = messages.data.data
                $rootScope.sumUnreadMessages = messagesService.sumUnreadMessages(vm.userMessages);
                console.log(  $rootScope)
                vm.sumUnreadMessages =  $rootScope.sumUnreadMessages
                console.log('sumUnreadMessages', vm.sumUnreadMessages);
                // for(var i=0; i<messages.data.data.length; i++){
                //   vm.userMessages.push(messages.data.data[i]);
      
                // }
                console.log(vm.userMessages)
              })
              .catch(function(err) {
                $log.debug(err);
              });
          
          // tournamentsService.getAllTournaments()
          //   .then(tournaments => {
          //     vm.tournaments = tournaments.data.data
          //     console.log('vm.tournaments: ', vm.tournaments);
          //   })
          // gamesService.getGamesByUserID(userId)
          //   .then((games)=>{
          //     // console.log(games)
          //     vm.userGames = games.data.data;
          //     // console.log(vm.userGames)
          //   })
          //   .catch(function(err) {
          //     $log.debug(err);
          //   });

          
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
      editUser(newWinner, newWinner.userid, newWinner.userName +' wins upadted to '+ newWinner.wins);
      editUser(oldWinner, oldWinner.userid, oldWinner.userName + ' wins upadted to ' + oldWinner.wins);
    });

    $rootScope.$on('selectWinner', function(event, newWinner) {
      console.log('selectWinnerEvent in user controller', event)
      console.log('selectWinnerData in user controller',newWinner)
      newWinner = findItemById($rootScope.users, newWinner.userid);
      newWinner.wins += 1;
     
      editUser(newWinner, newWinner._id, newWinner.userName +' wins upadted to '+ newWinner.wins);
      
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

      if(localStorage.get('activeTab')){
        localStorage.update('activeTab', vm.activeTab);

      } else{
        localStorage.set('activeTab', vm.activeTab)
      }
      
    }
    /**
     * Submit form: either create or edit user
     */
    function upload (file) {
      console.log(file)
      Upload.upload({
        
          url: 'http://localhost:5000/api/v1/uploads',
          data: {file: file, 'userId': vm.currentUser._id}
      }).then(function (resp) {
        vm.profileImage = resp.data.data
        console.log('profileImage: ', vm.profileImage);
          console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
      }, function (resp) {
          console.log('Error status: ' + resp.status);
      }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
  };
    

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

    

    function editUser(user, userId, msg) {
      if(!msg){
        var msg = user.userName + 'upadte sccessfull';
      }
      if(vm.profileImage){
        user.profileImageFileName = vm.profileImage.file.filename

      }
      if (!user) return;
      console.log('user before update', user);
      usersService.editUser(user, userId)
        .then(function(updatedUser) {
          // console.log(updatedUser);
          var updatedUser = updatedUser.data.data;
          vm.user = updatedUser;
          console.log('updatedUser', vm.user);
          // if(vm.isUser){
          //   localStorage.update('user', vm.user)
          // }
          $log.debug('updatedUser', updatedUser);
          

           
          // Swal.fire(updatedUser.userName +' Update successful!');
          
          Swal.fire({
            position: 'center',
            type: 'success',
            title: msg,
            showConfirmButton: false,
            timer: 1200
          });
          // $scope.$apply();
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
      
      friendsService.addToFriends(userToAdd, targetUser);
      
      vm.areFriends = true;
      
      editUser(userToAdd, userToAdd._id, userToAdd.userName +' friends updated ' );
      editUser(targetUser, targetUser._id, targetUser.userName +' friends updated ' );
      localStorage.update('user', targetUser);
      vm.currentUser = targetUser
    }

    function removeFromFriends(userToRemove, targetUser){
      console.log('userToRemove: ', userToRemove);
      console.log('remove from: ', targetUser);
      friendsService.removeFromFriends(userToRemove, targetUser)
      
      editUser(userToRemove, userToRemove._id, userToRemove.userName +' friends updated ' );
      editUser(targetUser, targetUser._id, targetUser.userName +' friends updated ' );
      localStorage.update('user', targetUser);
      vm.areFriends = false;
    }

    
    
    

  }

})();
