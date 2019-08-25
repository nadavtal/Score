;(function() {

  'use strict';

  /**
   * Show user list table
   *
   * @usage <user-list users="vm.tournaments"></user-list>
   */

  angular
    .module('boilerplate')
    .component('tournamentList', {
      bindings: {
        tournaments: '<'
      },
      templateUrl: 'app/tournament-list/tournament-list.html',
      controllerAs: 'vm',
      controller: tournamentListCtrl
    });

    tournamentListCtrl.$inject = ['$scope', '$log', 'QueryService', 'tournamentsService', 'localStorage', '$stateParams', 'ngDialog', '$state', 'usersService'];

  function tournamentListCtrl($scope,$log, QueryService, tournamentsService, localStorage, $stateParams, ngDialog, $state, usersService) {
    var vm = this;
    vm.createTournament = createNewTournament;
    vm.createNewTournament = createNewTournament;
    
    
    vm.removeTournament = function(index, tournamentId){
      QueryService
        .query('POST', 'tournaments/'+ tournamentId, null, null)
        .then(function(deletedtournament) {
          console.log('deletedtournament', deletedtournament)
          vm.tournaments.splice(index,1)
        })
      
    }
    
    vm.$onInit = function() {
      console.log('getting tournaments');
      vm.currentUser = localStorage.get('user');
      var userId = vm.userId || $stateParams.userId;
      var groupId = vm.groupId || $stateParams.groupId
      // tournamentsService.getAllTournamentsFromDataBase()
      //   .then((data) => {
      //     console.log(data)
      //   });
      if(userId){
        
        console.log('getting tournaments of user:' , userId)
        usersService.getUser(userId)
          .then((user) => {
            vm.user = user.data.data
            if(vm.currentUser._id == vm.user._id){
              vm.isUser = true
            };
            tournamentsService.getTournamentsByUserID(userId)
              .then((tournaments) => {
                vm.tournaments = tournaments.data.data;
                console.log(vm.tournaments)
              })
          })

      } 
      if (groupId){
          
        vm.createTournament = createNewGroupTournament;
        vm.createTournament = createNewGroupTournament;
        console.log('groupid ', vm)
      }      
      else{
        console.log('no userId or groupId')
        
        vm.createTournament = createNewTournament;
        vm.createTournament = createNewTournament;
      }
      

      
      
      
    };

    
    function createNewTournament(){
      // console.log('creating new tournament');
      $state.go('createTournament');
      
    }

    function createNewTournament(){
      console.log('creating new tournament');
      $state.go('createTournament');
      
    }

    function createNewGroupTournament(){
      $state.go('createGroupTournament', {'groupId': $stateParams.groupId});
    }
    function createNewGroupTournament(){
      console.log('group tournament')
      $state.go('createGroupTournament', {'groupId': $stateParams.groupId});
    }
    

    /// definitions

    /**
     * Get users
     */
    

    
    function getTournamentsOfGroupId(groupId) {
      
      QueryService
        .query('GET', 'groups/'+ groupId+'/tournaments/', null, null)
        
        .then(function(data) {
          
          vm.tournaments = data.data.data;
          console.log(vm.tournaments)
          $scope.$apply();
        })
        .catch(function(err) {
          $log.debug(err);
        });
    }
  }

  

})();
