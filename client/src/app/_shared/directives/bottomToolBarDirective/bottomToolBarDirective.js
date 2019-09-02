

;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('bottomToolBarDirective', bottomToolBarDirective);
  
    bottomToolBarDirective.$inject = ['$q', '$injector'];
  
    function bottomToolBarDirective($q, $injector) {
        
        return {
            templateUrl: 'app/_shared/directives/bottomToolBarDirective/bottomToolBarDirective.htm',
            link: function (scope, element, attributes) {
                // console.log(scope)
                scope.backToMain = backToMain;



                function backToMain(){
                    console.log('backto main')
                    vm.activeTab = '';
                    localStorage.remove('activeTab');
                    // console.log(scope);
                    vm.showMenuTab = false;
                    $('.userContent').css('top', '100vh')
                    $('.userContentWrapper').css({
                      'opacity': 0,
                        'height' : 0})
                  }
            }
        };
  
      
  
    }
  })();
  