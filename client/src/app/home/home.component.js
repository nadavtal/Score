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
    vm.loaded = true;
    vm.user = localStorage.get('user');
    
    

    



    
    
    

    
  

    

    
      
  }
      



  

})();
