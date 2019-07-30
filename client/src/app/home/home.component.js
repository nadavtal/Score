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
    vm.changeActiveTab = changeActiveTab;
    vm.backToMain = backToMain
    vm.$onInit = function() {
      
      
      
    }

    function backToMain(){
      vm.activeTab = '';
      vm.showMenuTab = false;
      $('.userContent').css('top', '100vh')
      $('.userContentWrapper').css({
        'opacity': 0,
          'height' : 0})
    }

    function changeActiveTab(tab){
      console.log(tab);
      vm.activeTab = tab;
      vm.showMenuTab = true;
      $('.userContent').css('top', '5rem')
      
      $('.userContentWrapper').css({
                                'opacity': 1,
                                  'height' : 'auto'})
      
      $('.cubeMenuItem--iconSmall').on('click', function(){
        // $(this).css('transform', 'rotateY(180deg)')
      })
      
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
