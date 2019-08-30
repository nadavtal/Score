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

    GameListCtrl.$inject = ['$scope', '$log', 'QueryService', 'gamesService', 'localStorage', '$stateParams', 'ngDialog', '$state', 'usersService', 'tournamentsService'];

  function GameListCtrl($scope,$log, QueryService, gamesService, localStorage, $stateParams, ngDialog, $state, usersService, tournamentsService) {
    var vm = this;
    
    
    
    vm.removeGame = function(index, gameId){
      QueryService
        .query('POST', 'games/'+ gameId, null, null)
        .then(function(deletedgame) {
          console.log('deletedgame', deletedgame)
          vm.games.splice(index,1)
        })
      
    }
    
    vm.$onInit = function() {
      
      vm.currentUser = localStorage.get('user');
      var userId = vm.userId || $stateParams.userId;
      var groupId = vm.groupId || $stateParams.groupId
      // gamesService.getAllGamesFromDataBase()
      //   .then((data) => {
      //     console.log(data)
      //   });
      if(userId){
        vm.createGame = createNewGame;
        vm.createTournament = createNewTournament;
        vm.createNewTournament = createNewTournament;
        
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
            tournamentsService.getAllTournaments()
              .then(tournaments => {
                vm.tournaments = tournaments.data.data
                console.log('vm.tournaments: ', vm.tournaments);
              });
            tournamentsService.getTournamentsByUserID(vm.user._id)
              .then(tournaments => {
                vm.tournaments = tournaments.data.data
                console.log('vm.tournaments: ', vm.tournaments);
              })

          })

      } 
      else if (groupId){
          
        vm.createGame = createNewGroupGame;
        vm.createTournament = createNewGroupTournament;
        tournamentsService.getTournamentsByGroupId(groupId)
            .then((tournaments)=>{
              vm.tournaments = tournaments.data.data;
              console.log('group tournaments: ', vm.tournaments);
            });
        console.log('groupid ', vm)
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
