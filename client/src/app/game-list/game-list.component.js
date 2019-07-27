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

    GameListCtrl.$inject = ['$scope', '$log', 'QueryService', '$rootScope', 'localStorage', '$stateParams', 'ngDialog', '$state'];

  function GameListCtrl($scope,$log, QueryService, $rootScope, localStorage, $stateParams, ngDialog, $state) {
    var vm = this;
    vm.user = localStorage.get('user');
    vm.getGamesOfUserId = getGamesOfUserId
    
    vm.removeGame = function(index, gameId){
      QueryService
        .query('POST', 'games/'+ gameId, null, null)
        .then(function(deletedgame) {
          console.log('deletedgame', deletedgame)
          vm.games.splice(index,1)
        })
      
    }
    
    vm.$onInit = function() {
      console.log($scope)
      if($stateParams.userId){
        console.log('getting games of user:' , $stateParams.userId)
          // getGamesOfUserId($stateParams.userId)

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
    

    function getGamesOfUserId(userId) {
      
      QueryService
        .query('GET', 'games/user/'+userId, null, null)
        
        .then(function(data) {
          
          vm.games = data.data.data;
          console.log(vm.games)
          $scope.$apply();
        })
        .catch(function(err) {
          $log.debug(err);
        });
    }
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
