

;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('flippingButtonDirective', flippingButtonDirective);
  
    flippingButtonDirective.$inject = ['$q', '$injector', '$state'];
  
    function flippingButtonDirective($q, $injector, $state) {
        
        return {
            restrict: 'E',
            scope: {
                color1: '=',
                functionOne: '&',
                functionTwo: '&',
              //   registerToTournament: '&',
            },
            templateUrl: 'app/_shared/directives/flippingButtonDirective/flippingButtonDirective.htm',
            replace: true,        
            link: function(scope, elm, attrs) { 
                // console.log(attrs);
                var regiser = elm[0].children[0];
                var wrappedRegister = angular.element(regiser);
                var unRegister = elm[0].children[1];
                var wrappedUnRegister = angular.element(unRegister);
                applyInitialClassByCondidion(attrs.condition);

                scope.showIcon = attrs.showicon;
                scope.actionOneName = attrs.actionOneName
                scope.actionTwoName = attrs.actionTwoName
                // console.log(scope.actionOneName, scope.actionTwoName)
                scope.function1 = function1;
                scope.reset1 = reset1;
                scope.function2 = function2;
                

                function function1($event){
                    wrappedRegister.toggleClass('is-active')
                    wrappedUnRegister.toggleClass('is-active')
                    scope.functionOne();
                    
                    // setTimeout(function() {
                    //     wrappedMeter1.toggleClass('is-done');
                    // }, 4000);
                }
                function function2($event){
                    wrappedRegister.toggleClass('is-active')
                    wrappedUnRegister.toggleClass('is-active')
                    // console.log(wrappedUnRegister);
                    scope.functionTwo();
                    // setTimeout(function() {
                    //     wrappedMeter1.toggleClass('is-done');
                    // }, 4000);
                }

                function reset1(){
                    wrappedRegister.removeClass('is-active');
                    wrappedUnRegister.removeClass('is-active');
                    wrappedMeter1.removeClass('is-done');
                }

                function applyInitialClassByCondidion(condition){
                    // console.log(condition);
                    if(condition == 'true'){
                        wrappedRegister.addClass('is-active');
                        wrappedUnRegister.removeClass('is-active');
                    }else{
                        wrappedRegister.removeClass('is-active');
                        wrappedUnRegister.addClass('is-active');
                    }
                }
            }
        }
             
  
    }

    
  })();
  