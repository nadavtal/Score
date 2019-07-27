;(function() {

  'use strict';

  angular
    .module('boilerplate')
    .component('clashUser', {
      bindings: {
        usertag: '='
      },
      templateUrl: 'app/clashUser/clashUser.html',
      controllerAs: 'vm',
      controller: clashUserCtrl
    });

  clashUserCtrl.$inject = ['$log', '$state', '$stateParams', 'QueryService', 'localStorage', 'clashUserService',
    'ngDialog', '$rootScope', '$scope'];

  function clashUserCtrl($log, $state, $stateParams, QueryService, localStorage, clashUserService) {
    
    var vm = this;
    console.log('clash user component')
    
    
    // methods
    

    vm.$onInit = function() {
      
      var usertag = $stateParams.usertag;
      var clantag = $stateParams.clantag;
      var state = $state.current.name;
      vm.currentUser = localStorage.get('user');
      vm.user = vm.user || {};
      vm.activeTab = 'info'
      vm.changeActiveTab = function(tab){
        vm.activeTab = tab
      }
      console.log($stateParams)
      

      if (usertag)
        clashUserService.getClashUser(usertag)
          .then(function(user) {
            
            vm.user = user.data;
            

            console.log('user', vm.user);
            
            $log.debug('user', vm.user);
          })
          .catch(function(err) {
            $log.debug(err);
          });
        getClashUserBattles(usertag)
        // setInterval(function(){ getClashUserBattles(usertag); }, 60000);
    };

   function getClashUserBattles(usertag) {
      console.log('getting clash user battles')
      if (!usertag) return;
      // else{
      //   var reparedClanId = usertag.slice(0,2)+'32'+usertag.slice(2, usertag.length)
      //   console.log('getting clash clan', reparedClanId)
      // }
      console.log(usertag)
      
      var reparedUserId = '%23'+ usertag.slice(1, usertag.length)
      console.log(usertag, reparedUserId)
      QueryService
        .query('GET', 'clashusers/'+reparedUserId+'/battles', null, null)
        .then(function(battles) {
          
          vm.userBattles = battles.data;
          

          console.log('vm.userBattles', vm.userBattles);
          
          $log.debug('vm.userBattles', vm.userBattles);
        })
        .catch(function(err) {
          $log.debug(err);
        });
    
    }

    

  }

})();
