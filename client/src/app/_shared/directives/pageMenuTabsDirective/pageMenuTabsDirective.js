

;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('pageMenuTabsDirective', pageMenuTabsDirective);
  
    pageMenuTabsDirective.$inject = ['$q', '$injector'];
  
    function pageMenuTabsDirective($q, $injector) {
        
        return {
            templateUrl: 'app/_shared/directives/pageMenuTabsDirective/pageMenuTabsDirective.htm',
            link: function (scope, element, attributes) {
                console.log(scope)
            }
        };
  
      
  
    }
  })();
  