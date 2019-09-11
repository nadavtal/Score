

;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('shareButtonDirective', shareButtonDirective);
  
    shareButtonDirective.$inject = ['$q', '$injector', '$state'];
  
    function shareButtonDirective($q, $injector, $state) {
        
        return {
            restrict: 'E',
            scope: {
                color1: '=',
                functionOne: '&',
                functionTwo: '&',
              //   registerToTournament: '&',
            },
            templateUrl: 'app/_shared/directives/shareButtonDirective/shareButtonDirective.htm',
            replace: true,        
            link: function(scope, elm, attrs) { 
                scope.positions = {
                    bottom: 'bottom',
                    right: 'right',
                    left: 'left',
                    top: 'right',
                    below: 'below',
                    
                }
            }
        }
             
  
    }

    
  })();
  