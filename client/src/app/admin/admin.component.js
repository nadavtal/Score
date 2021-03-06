;(function() {

  'use strict';

  angular
    .module('boilerplate')
    .component('admin', {
      bindings: {
        userId: '<'
      },
      templateUrl: 'app/admin/admin.html',
      controllerAs: 'vm',
      controller: adminCtrl
    });

  adminCtrl.$inject = ['$log', 'tournamentsService', 'platformTypesService', 'localStorage', 'platformService', 'accountsService', 
    'ngDialog', '$rootScope', '$scope', 'clashUserService', 'gamesService','usersService', 'groupsService','gameTypesService', 'messagesService'];

  function adminCtrl($log, tournamentsService, platformTypesService, localStorage, platformService, accountsService, 
      ngDialog, $rootScope, $scope, clashUserService, gamesService, usersService, groupsService, gameTypesService, messagesService) {
    var vm = this;
    
    vm.submitAddPlatform = submitAddPlatform;
    vm.submitAddGameType = submitAddGameType;
    vm.submitAddPlatformType = submitAddPlatformType;
    vm.submitUserForm = submitUserForm
    
    // methods
    
    
    
    $scope.$on('user:login', function() {
      vm.currentUser = localStorage.get('user');
      $rootScope.user = vm.currentUser;
      console.log('user from logging in', vm.user)
      
    });
    vm.$onInit = function() {
      
      vm.currentUser = localStorage.get('user');
      
      usersService.getAllUsers()
          .then((data) => {
            vm.users = data.data.data;
            console.log('all users: ', vm.users)
          })

      usersService.getAllFiles()
      .then((data) => {
        console.log(data)
        vm.files = data.data.data;
        console.log('all files: ', vm.files)
      })
            
      accountsService.getAllAccountsFromDataBase()
      .then((accounts) => {
        vm.accounts = accounts.data.data
        console.log('all accounts', vm.accounts)
      })

      platformService.getAllPlatformsFromDataBase()
      .then((platforms) => {
        vm.platforms = platforms.data.data;
        console.log('platforms:', vm.platforms)
        
       });

       gameTypesService.getAllGameTypes()
       .then((gameTypes) => {
        vm.gameTypes = gameTypes.data.data;
        console.log('gameTypes:', vm.gameTypes)
        
       });

       platformTypesService.getAllPlatformTypes()
       .then((platformTypes) => {
        vm.platformTypes = platformTypes.data.data;
        console.log('platformTypes:', vm.platformTypes)
        
       });

       gamesService.getAllGamesFromDataBase()
        .then((data) => {
          vm.games = data.data.data;
          console.log('all games:', vm.games)
        });

        groupsService.getAllGroupsFromDataBase()
          .then(function(groups) {
            // console.log(game)
            vm.groups = groups.data.data;
            console.log('allgroups', vm.groups)
            $log.debug('groups', vm.groups);
          })
          .catch(function(err) {
            $log.debug(err);
          });
        messagesService.getAllMessages()
          .then((messages) => {
            console.log('all messages: ', messages.data.data)
          });

        tournamentsService.getAllTournaments()
          .then(tournaments => {
            console.log('all tournaments: ', tournaments.data.data)
          })
        clashUserService.getAllClashUsers()
          .then((clashUsers) => {
            console.log('all clashUsers: ', clashUsers.data.data)
          });

    
    
    // addToMyFriends('')

    }

    function submitAddPlatform(platform){
      console.log(platform)
      platformService.addPlatformToDB(platform)
        .then((data)=> {
          console.log(data)
        })
    }

    function submitUserForm(user) {
      console.log(user);
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

          

        })
        .catch(function(err) {
          $log.debug(err);
        });
      
    }

    function submitAddPlatformType(platformType){
      console.log(platformType);
      platformTypesService.addPlatformTypeToDB({name: platformType})
        .then((data)=> {
          console.log(data)
        })
    }

    function submitAddGameType(gameType){
      console.log(gameType);
      gameTypesService.addGameTypeToDB({name: gameType})
        .then((data)=> {
          console.log(data)
        })
    }
  }

})();
