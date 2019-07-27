;(function() {

  'use strict';

  angular
    .module('boilerplate')
    .component('clan', {
      bindings: {
        clanTag: '<'
      },
      templateUrl: 'app/clan/clan.html',
      controllerAs: 'vm',
      controller: clanCtrl
    });

  clanCtrl.$inject = ['$log', '$state', '$stateParams', 'QueryService', 'localStorage', 'clanService',
    'ngDialog', '$rootScope', '$scope'];

  function clanCtrl($log, $state, $stateParams, QueryService, localStorage, clanService,
      ngDialog, $rootScope, $scope) {
    var vm = this;

    // methods
    $scope.$watch('vm.friendlyBattles', function(){
      console.log('vm.friendlyBattles changed')
    })
    
    /**
     * Submit form: either create or edit user
     */
    

    vm.$onInit = function() {
      var clanid = vm.clanid || $stateParams.clantag;
      var state = $state.current.name;
      vm.user = localStorage.get('user') || {};
      vm.registerd = false;
      vm.allClanBattles = []
      vm.friendlyBattles = [];
      console.log(clanid)
      if(!$rootScope.users){
        console.log('no rootscope users');
        // getUsers();
        
      } else{
        vm.users = $rootScope.users;
        
      }

      vm.activeTab = 'members'
      vm.changeActiveTab = function(tab){
        vm.activeTab = tab
      }     
      
      
      if (clanid) {
        console.log(clanid)
        clanService.getClan(clanid)
        .then((clan)=>{
          console.log(clan)
          vm.clan = clan.data;
          clanService.getAllBattlesByClan(clan)
          .then((values) => {
            console.log(values);
            for(var i = 0; i<values.length; i++){
              for(var j = 0; j<values[i].data.length; j++){
                vm.allClanBattles.push(values[i].data[j])
              }
            }
            // $scope.$apply();
            console.log(vm.allClanBattles)
            clanService.findFriendlyBattles(vm.allClanBattles)
            .then((battles) => {
              vm.friendlyBattles = battles
              console.log(vm.friendlyBattles)
              $scope.$apply();
            })  
          })
        })
      }
       
      else vm.clan = {}
      
      
        
      
    };

    
    function getClan(clanId) {
      if (!clanId) return;
      console.log('gettingclan', clanId);
      var reparedClanId = '%23'+ clanId.slice(1, clanId.length);
      console.log('gettingclan', reparedClanId);
      QueryService
        .query('GET', 'clashclans/'+reparedClanId, null, null)
        .then((clan) =>{
          
          vm.clan = clan.data;
          console.log(vm.clan)
        })
        
        
        
        .catch(function(err) {
          $log.debug(err);
        })
    }
        
    

    function getAllClanBattles(clan){
      vm.allClanBattles = [];
      var getAllBattlesPromise = new Promise((resolve, reject) => {
        console.log('running promise', clan)
        for (var i= 0; i < clan.memberList.length; i++){
          
          var reparedUserId = '%23'+ clan.memberList[i].tag.slice(1, clan.memberList[i].tag.length)
          // console.log(reparedUserId);
          QueryService
          .query('GET', 'clashusers/'+reparedUserId+'/battles', null, null)
          .then(function(battles) {
            console.log('got battles of player')
            for (var i= 0; i < battles.data.length; i++){
              vm.allClanBattles.push(battles.data[i])
            }
            
          })
        }
        
        resolve(vm.allClanBattles);
        reject('getAllBattlesPromise not working')
      })
      return getAllBattlesPromise
      

      
    }

    function getClashUserBattles(usertag) {
      
      if (!usertag) return;
      
      var reparedUserId = '%23'+ usertag.slice(1, usertag.length)
      
      QueryService
        .query('GET', 'clashusers/'+reparedUserId+'/battles', null, null)
        .then(function(battles) {
          // console.log(battles)
          getFriendlyBattles(battles.data);
          return addBattleToArray(battles.data, vm.allClanBattles)
           vm.allClanBattles;
          
          $log.debug('vm.friendlyBattles', vm.allClanBattles);
        })
        
        
        .catch(function(err) {
          $log.debug(err);
        });
    
    }

    function addBattleToArray(array, targetArray){
      for (var i= 0; i < array.length; i++){
        targetArray.push(array[i])
      }
      // console.log(targetArray)
      return targetArray
    }

    function getFriendlyBattles(battles){
      var friendlyBattles = new Promise((resolve, reject) => {
        console.log(battles.length)
        for (var i= 0; i < battles.length; i++){
          console.log(battles[i].type)
          if(battles[i].type == 'friendly'){
            
            if(!checkIfBattleInArray(vm.friendlyBattles, battles[i])){
              
              vm.friendlyBattles.push(battles[i]);
              // addBattleToDataBase(battles[i])
              
            }
            
          }
        }
        resolve(vm.friendlyBattles);
        reject('didnt get friendly battles')
      })
      
      
      return friendlyBattles
      
    }
    
    function addBattleToDataBase(battle){
      console.log(vm.friendlyBattles)
      console.log('adding battle to data base', battle);
      
      QueryService.query('POST', 'clashclans/'+clanid, null, battle).then(function(data){
        console.log(data)
      });
      
    }

    

    function checkIfBattleInArray(array, battle){
      var inArray = false
      for (var i= 0; i < array.length; i++){
        if(array[i].battleTime == battle.battleTime){
          inArray = true
        }
        
      }

      return inArray
    }
  }

})();
