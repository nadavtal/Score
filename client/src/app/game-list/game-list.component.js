;(function() {

  'use strict';

  /**
   * Show user list table
   *
   * @usage <user-list users="vm.games"></user-list>
   */

  angular
    .module('boilerplate')
    .component('gameList', {
      bindings: {
        games: '<'
      },
      templateUrl: 'app/game-list/game-list.html',
      controllerAs: 'vm',
      controller: GameListCtrl
    });

    GameListCtrl.$inject = ['$scope', '$log', 'QueryService', 'gamesService', 'localStorage', '$stateParams', 'utils', '$state', 'usersService', 'tournamentsService'];

  function GameListCtrl($scope,$log, QueryService, gamesService, localStorage, $stateParams, utils, $state, usersService, tournamentsService) {
    var vm = this;
    vm.removeGame = removeGame
    vm.removeGame = removeGame
    vm.removeTournament = removeTournament
    vm.showManagedTournaments = showManagedTournaments;
    vm.showRegisteredTournaments = showRegisteredTournaments;
    vm.currentUser = localStorage.get('user');
    var userId = vm.userId || $stateParams.userId;
    var groupId = vm.groupId || $stateParams.groupId
    var today = new Date(Date.now());
    
    vm.$onInit = function() {
      
      
      
      if(userId){
        vm.createGame = createNewGame;
        vm.createTournament = createNewTournament;
        
        vm.listTitle = 'registered tournaments';
        
        usersService.getUser(userId)
          .then((user) => {
            vm.user = user.data.data
            if(vm.currentUser._id == vm.user._id){
              vm.isUser = true;
              console.log('vm.isUser: ', vm.isUser)
            };

            

            gamesService.getGamesByUserID(userId)
              .then((games) => {
                vm.games = games.data.data;
                console.log(vm.games)
              });
            
            tournamentsService.getTournamentsByUserID(vm.user._id, {time: today})
              .then(tournaments => {
                vm.registeredTournaments = tournaments.data.data
                console.log('vm.tournaments: ', vm.tournaments);
                console.log($scope)
              })
            tournamentsService.getTournamentsManagedByUserName(vm.user.userName, {time: today})
              .then(tournaments => {
                vm.managedTournaments = tournaments.data.data;
                console.log('vm.managedTournaments: ', vm.managedTournaments);
                if(vm.managedTournaments.length > 0){
                  showRegisteredTournaments();

                } else{
                  showManagedTournaments();
                }
                console.log($scope)
              })

          })

      } 
      else if (groupId){
          
        vm.createGame = createNewGroupGame;
        vm.createTournament = createNewGroupTournament;
        tournamentsService.getTournamentsByGroupId(groupId)
            .then((tournaments)=>{
              vm.tournaments = tournaments.data.data;
              vm.registeredTournaments = vm.tournaments
              vm.managedTournaments = vm.registeredTournaments.filter(function(value){
                // console.log(value)
                return value.manager == vm.currentUser.userName;
            
              });;
              showRegisteredTournaments();
              console.log('group tournaments: ', vm.tournaments);
            });
        console.log('groupid ', groupId)
      }      
      else{
        console.log('no userId or groupId')
        
        vm.createGame = createNewGame;
        vm.createTournament = createNewTournament;
      }
      

      
      
      
    };

    
    function createNewGame(){
      // console.log('creating new game');
      $state.go('createGame');
      
    }

    function removeGame(index, gameId){
      gamesService.removeGame(gameId)
      .then(function(deletedgame) {
        console.log('deletedgame', deletedgame)
        vm.games.splice(index,1)
      })
    }

    function removeTournament(index, tournamentId){
      tournamentsService.deleteTournament(tournamentId)
      .then(function(deletedtournament) {
        console.log('deletedtournament', deletedtournament)
        vm.tournaments.splice(index,1)
      })
    }

    function createNewTournament(){
      console.log('creating new tournament');
      $state.go('createTournament');
      
    }

    function createNewGroupGame(){
      $state.go('createGroupGame', {'groupId': $stateParams.groupId});
    }
    function createNewGroupTournament(){
      console.log('group tournament')
      $state.go('createGroupTournament', {'groupId': $stateParams.groupId});
    }
    
    function showRegisteredTournaments(){
      vm.tournaments = vm.registeredTournaments;
      console.log(vm.tournaments);
      if(groupId){
        vm.listTitle = 'group tournaments';
      } else{
        vm.listTitle = 'Registered tournaments';

      }
    }
    function showManagedTournaments(){
      vm.tournaments = vm.managedTournaments;
      console.log(vm.tournaments);
      vm.listTitle = 'Managed tournaments';
    }

    /// definitions

    /**
     * Get users
     */
    

    
    function getGamesOfGroupId(groupId) {
      
      QueryService
        .query('GET', 'groups/'+ groupId+'/games/', null, null)
        
        .then(function(data) {
          
          vm.games = data.data.data;
          console.log(vm.games)
          $scope.$apply();
        })
        .catch(function(err) {
          $log.debug(err);
        });
    }
  }

  

})();
