;(function() {

  'use strict';

  angular
    .module('boilerplate')
    .component('home', {
      templateUrl: 'app/home/home.html',
      controllerAs: 'vm',
      controller: HomeCtrl
    });


  HomeCtrl.$inject = ['$scope', 'QueryService', '$log', '$rootScope', 'localStorage', 'platformService', 'accountsService', '$timeout'];

  function HomeCtrl($scope, QueryService, $log, $rootScope, localStorage, platformService, accountsService, $timeout) {
    // console.log('rootscope', $rootScope);
    var vm = this
    vm.submitAddPlatform = submitAddPlatform;
    vm.user = localStorage.get('user');
    
    

    function submitAddPlatform(platform){
      console.log(platform)
      platformService.addPlatformToDB(platform)
        .then((data)=> {
          console.log(data)
        })
    }



    
    
    

    
  

    

    
      
  }
      



  

})();
