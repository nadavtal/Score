

;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('switchCheckBoxDirective', switchCheckBoxDirective);
  
    switchCheckBoxDirective.$inject = ['$q', '$injector', '$state'];
  
    function switchCheckBoxDirective($q, $injector, $state) {
        
        return {
            restrict: 'E',
            scope: {
                
                trueFunction: '&',
                falseFunction: '&',
              //   registerToTournament: '&',
            },
            templateUrl: 'app/_shared/directives/switchCheckBoxDirective/switchCheckBoxDirective.htm',
            replace: true,        
            link: function(scope, elm, attrs) { 
               scope.checked = true;
               scope.clicked = clicked;
               console.log(scope.checked);
            //    clicked();

               function clicked() {
                
                if(scope.checked){
                    scope.checked = false;
                    trueFunction();
                } else{
                    scope.checked = true;
                    falseFunction()
                }
               }
               function trueFunction(){
                console.log('true function');
                scope.trueFunction()
               }
               function falseFunction(){
                console.log('false function');
                scope.falseFunction()
               }
            }
        }
             
  
    }

    
  })();
  