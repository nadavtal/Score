

;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('flippingButtonMeterDirective', flippingButtonMeterDirective);
  
    flippingButtonMeterDirective.$inject = ['$q', '$injector', '$state'];
  
    function flippingButtonMeterDirective($q, $injector, $state) {
        
        return {
            restrict: 'E',
            
            templateUrl: 'app/_shared/directives/flippingButtonMeterDirective/flippingButtonMeterDirective.htm',
            link: function (scope, element, attributes) {
               
                var download = document.getElementsByClassName("download");
                var wrappedDownload = angular.element(download);
                var meter = document.getElementsByClassName("meter");
                var wrappedMeter = angular.element(meter);

                
                scope.buttonClicked = buttonClicked;
                scope.reset = reset;

                function buttonClicked($event){
                    wrappedDownload.toggleClass('is-active')
                    // console.log($event);
                    setTimeout(function() {
                        wrappedMeter.toggleClass('is-done');
                    }, 4000);
                }

                function reset(){
                    wrappedDownload.removeClass('is-active');
                   
                    wrappedMeter.removeClass('is-done');
                }


                

                

            }

        }
             
  
    }

    
  })();
  