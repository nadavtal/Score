;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('usersSelectDirective', usersSelectDirective);
  
    usersSelectDirective.$inject = ['$q', '$injector'];
  
    function usersSelectDirective($q, $injector) {
        console.log('usersSelectDirective');
        return {
            templateUrl: 'app/_shared/directives/usersSelectDirective/usersSelectDirective.htm',
            link: function (scope, element, attributes) {
                console.log(attributes.userlist);
                scope.userlist = attributes.userlist;
            }
        };
  
      
  
    }
  })();
  