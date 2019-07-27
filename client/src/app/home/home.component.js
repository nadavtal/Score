;(function() {

  'use strict';

  angular
    .module('boilerplate')
    .component('home', {
      templateUrl: 'app/home/home.html',
      controllerAs: 'vm',
      controller: HomeCtrl
    });


  HomeCtrl.$inject = ['QueryService', '$log', '$rootScope', 'localStorage', 'platformService'];

  function HomeCtrl(QueryService, $log, $rootScope, localStorage, platformService) {
    // console.log('rootscope', $rootScope);
    var vm = this
    vm.submitAddPlatform = submitAddPlatform;

    vm.$onInit = function() {
      
      
      vm.user = localStorage.get('user');
      
      
    }

    
    

    function submitAddPlatform(platform){
      console.log(platform)
      platformService.addPlatformToDB(platform)
        .then((data)=> {
          console.log(data)
        })
    }



    
    
    

    
  

    

    
      
  }
      



  

})();
