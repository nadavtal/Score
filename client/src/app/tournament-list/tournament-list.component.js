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

    tournamentListCtrl.$inject = ['$scope', '$log', '$timeout', 'tournamentsService', 'localStorage', 'platformTypesService', 'utils', 'gameTypesService', 'platformService'];

  function tournamentListCtrl($scope,$log, $timeout, tournamentsService, localStorage, platformTypesService, utils, gameTypesService, platformService) {
    var vm = this;
    vm.searchByPlatform = searchByPlatform
    vm.searchByPlatformType = searchByPlatformType
    vm.searchByBuyIn = searchByBuyIn
    vm.searchByPrizePool = searchByPrizePool
    vm.searchByNumPlayers = searchByNumPlayers
    vm.toggleSearchForm = toggleSearchForm; 
    
    vm.orderBy = orderBy;
    
    
    vm.$onInit = function() {
      console.log('getting tournaments');
      vm.currentUser = localStorage.get('user');
      console.log('vm.currentUser', vm.currentUser);
      vm.prameter = 'time'
      vm.reverse = true
      vm.show = false;
      var today = new Date(Date.now());
      console.log(today)
      utils.getItems('tournaments', 'time',today , '$lt')
            .then(function(tournaments){
              console.log('tournaments before today' , tournaments.data.data)
          })

      tournamentsService.getAllTournaments({privacy: 'public', time: today})
        .then(function(tournaments){
          vm.tournaments = tournaments.data.data  
          vm.show = true;
          console.log(vm.tournaments);
        })
      platformService.getAllPlatformsFromDataBase()
        .then(function(platforms) {
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

      
      
      
    };

    var timeoutPromise;
    
    function toggleSearchForm(event){
      console.log(event);
      var searchFormElement = angular.element(event.currentTarget.parentElement.nextElementSibling);
      searchFormElement.toggleClass('contentHidden');
      var filterElement = angular.element(event.currentTarget);
      filterElement.toggleClass('rotate');

  }

    function searchByPlatform(platformName){
      console.log(platformName);
      tournamentsService.getTournamentsByPlatform(platformName)
        .then(function(tournaments){
          console.log(tournaments);
          vm.tournaments = tournaments.data.data  
        })
    }
    function searchByPlatformType(platformType){
      console.log(platformType)
    }
    function searchByBuyIn(min, max){
      $timeout.cancel(timeoutPromise);
      timeoutPromise = $timeout(function() {
        // console.log(min, max);
        if(!min) min = 0;
        if(!max) max = 1000000;
        console.log(min, max);
        tournamentsService.getTournamentsByBuyIn(min, max)
        .then(function(tournaments){
          console.log(tournaments);
          vm.tournaments = tournaments.data.data  
        })
      }, 700);
     
    }
    function searchByPrizePool(min, max){
      $timeout.cancel(timeoutPromise);
      timeoutPromise = $timeout(function() {
        if(!min) min = 0;
        if(!max) max = 1000000;
        tournamentsService.getTournamentsByPrizePool(min, max)
        .then(function(tournaments){
          console.log(tournaments);
          vm.tournaments = tournaments.data.data  
        })
      }, 700);
    }
    function searchByNumPlayers(min, max){
      $timeout.cancel(timeoutPromise);
      timeoutPromise = $timeout(function() {
        if(!min) min = 0;
        if(!max) max = 1000000;
        console.log(min, max);
        tournamentsService.getTournamentsByMaxPlayers(min, max)
        .then(function(tournaments){
          console.log(tournaments);
          vm.tournaments = tournaments.data.data  
        })
      }, 700);
    }

    function orderBy($event, prameter){
      vm.show = false;
      vm.prameter = prameter;
      // console.log($event.currentTarget.children[0]);

      var filterElement = angular.element($event.currentTarget.children[0]);
      if (filterElement.hasClass('rotate')){
        vm.reverse = true;
      } else{
        vm.reverse = false;
      }
      console.log(vm.reverse)
      filterElement.toggleClass('rotate');
      setTimeout(function(){
        vm.show = true;
        console.log(vm.show);
        $scope.$apply();
      }, 200)
      // vm.show = true;
    }

    
    
  }

  

})();
