

;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('tournamentRowDirective', tournamentRowDirective);
  
    tournamentRowDirective.$inject = ['$q', '$injector'];
  
    function tournamentRowDirective($q, $injector) {
        
        return {
            templateUrl: 'app/_shared/directives/tournamentRowDirective/tournamentRowDirective.htm',
            link: function (scope, element, attributes) {
                // console.log(scope)
               
               
            }
        };
  
      
  
    }
  })();
  