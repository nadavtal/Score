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

    GameListCtrl.$inject = ['$scope', '$log', 'QueryService', 'gamesService', 'localStorage', '$stateParams', 'ngDialog', '$state', 'usersService'];

  function GameListCtrl($scope,$log, QueryService, gamesService, localStorage, $stateParams, ngDialog, $state, usersService) {
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
      gamesService.getAllGamesFromDataBase()
        .then((data) => {
          console.log(data)
        });
      if(userId){
        vm.createGame = createNewGame;
        console.log('getting games of user:' , userId)
        usersService.getUser(userId)
          .then((user) => {
            vm.user = user.data.data
            if(vm.currentUser._id == vm.user._id){
              vm.isUser = true
            };
            gamesService.getGamesByUserID(userId)
              .then((games) => {
                vm.games = games.data.data;
                console.log(vm.games)
              })
          })

      } else if ($stateParams.groupId){
        console.log('getting games of group:' , $stateParams.groupId)
          // getGamesOfGroupId($stateParams.groupId);
          vm.createGame = createNewGroupGame;
      }
      
      
      else{

        console.log('getting all games')
        // getGames();
        vm.createGame = createNewGame;
      }
      

      
      
      
    };

    
    function createNewGame(){
      console.log('creating new game');
      $state.go('createGame');
      // var dialog = ngDialog.open({
      //   template:'app/game/game.html',
      //   controller: 'GameCtrl',
      //   data: {
      //     myProperty: 'test'
      // }
        
      // });

      // dialog.closePromise.then(function(closedDialog) {
      //   $state.go('displayGame', { gameId: newGame._id });
      // });
    }

    function createNewGroupGame(groupId){
      $state.go('createGroupGame', {'groupId': $stateParams.groupId});
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
