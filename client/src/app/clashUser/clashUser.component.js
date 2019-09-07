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
    
    // methods
    

    vm.$onInit = function() {
      
      var usertag = $stateParams.usertag;
      var clantag = $stateParams.clantag;
      var state = $state.current.name;
      vm.currentUser = localStorage.get('user');
      console.log(vm.currentUser)
      vm.user = vm.user || {};
      vm.activeTab = 'info';
      vm.loading = true;
      


      vm.changeActiveTab = function(tab){
        vm.activeTab = tab
        console.log(vm.activeTab)
      }
      // $('.userContent').css('top', '5rem')
      // console.log($stateParams)
      

      if (usertag)
        clashUserService.getClashUser(usertag)
          .then(function(user) {
            vm.loading = false;
            vm.user = user.data.clashUser;
            vm.userBattles = user.data.updatedUser.battles
            
            console.log(vm.user);
            
   
          })
        // clashUserService.getClashUserBattles(usertag)
        // .then(function(battles) {
        //   console.log(battles)
        // });
    };

    function getClashUserBattles(usertag) {
      console.log('getting clash user battles: ', usertag)
      if (!usertag) return;


    }

    

  }

})();
