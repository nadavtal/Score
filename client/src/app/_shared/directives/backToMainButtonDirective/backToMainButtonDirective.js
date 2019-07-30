

;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('backToMainButtonDirective', backToMainButtonDirective);
  
    backToMainButtonDirective.$inject = ['$q', '$injector'];
  
    function backToMainButtonDirective($q, $injector) {
        
        return {
            templateUrl: 'app/_shared/directives/backToMainButtonDirective/backToMainButtonDirective.htm',
            scope: true,
            link: function (scope, element, attributes) {
                
                
            }
        };
  
      
  
    }
  })();
  