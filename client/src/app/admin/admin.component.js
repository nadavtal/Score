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

  adminCtrl.$inject = ['$log', '$state', '$stateParams', 'platformTypesService', 'localStorage', 'platformService', 'accountsService', 
    'ngDialog', '$rootScope', '$scope', 'clashUserService', 'gamesService','usersService', 'groupsService','gameTypesService'];

  function adminCtrl($log, $state, $stateParams, platformTypesService, localStorage, platformService, accountsService, 
      ngDialog, $rootScope, $scope, clashUserService, gamesService, usersService, groupsService, gameTypesService) {
    var vm = this;
    
    vm.submitAddPlatform = submitAddPlatform;
    vm.submitAddGameType = submitAddGameType;
    vm.submitAddPlatformType = submitAddPlatformType
    
    // methods
    
    
    
    $scope.$on('user:login', function() {
      vm.user = localStorage.get('user');
      $rootScope.user = vm.user;
      console.log('user from logging in', vm.user)
      
    });
    vm.$onInit = function() {
      
      vm.user = localStorage.get('user');;
      
      usersService.getAllUsers()
          .then((data) => {
            vm.users = data.data.data;
            console.log('all users: ', vm.users)
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
        
       }) ;

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

    
    
    // addToMyFriends('')

    }

    function submitAddPlatform(platform){
      console.log(platform)
      platformService.addPlatformToDB(platform)
        .then((data)=> {
          console.log(data)
        })
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
