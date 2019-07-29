;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('cubeMenuItemDirective', cubeMenuItemDirective);
  
      cubeMenuItemDirective.$inject = ['$state', '$timeout', '$location'];
  
    function cubeMenuItemDirective($state, $timeout, $location) {
        console.log('cubeMenuItemDirective');
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'app/_shared/directives/cubeMenuItemDirective/cubeMenuItemDirective.htm',
            link: function (scope, element, attributes) {
                
                console.log(scope);
                // console.log(element[0].parentElement.children);
                var allCubes = element[0].parentElement.children
                scope.title = attributes.title;
                // console.log(allCubes)
                // console.log(angular.element(element[0].parentElement.children));
                scope.status = 'cube'
                scope.$on('newTabSelected', function(event, data){
                    console.log('new tab selected', data, scope.title);
                    if(scope.title != data){
                        console.log('change this cube')
                        scope.status = 'tab'
                    }
                    
                })
                
               
                scope.expand = function(event){
                    if(scope.status == 'cube') scope.status = 'active';
                    else scope.status = 'cube';
                    scope.$emit('newTabSelected', scope.title);
                    
                    
                    
                }
                scope.bg = attributes.color
            },
            constroller: function($scope, $element, $attributes){
                
            }
        }
  
    }
  })();
  