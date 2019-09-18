

;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('buttonToModalDirective', buttonToModalDirective);
  
    buttonToModalDirective.$inject = ['$q', '$injector', '$state'];
  
    function buttonToModalDirective($q, $injector, $state) {
        
        return {
            restrict: 'E',
            scope: {
                
                ifTrueFunction: '&',
                ifFalseFunction: '&',
                
              //   registerToTournament: '&',
            },
            templateUrl: 'app/_shared/directives/buttonToModalDirective/buttonToModalDirective.htm',
            replace: true,        
            link: function(scope, elm, attrs) { 
              scope.condition = attrs.condition;
              console.log('condition in directive', scope.condition)
              allocateByCondition();

              scope.mainFunction = mainFunction
              scope.frontClick = frontClick;
              scope.cancelFunction = cancelFunction;

              var button = angular.element(elm[0]);
              console.log(button)
              function frontClick(event){
                // console.log(event);
                // console.log(button);
                var mx = event.clientX - button.offsetLeft,
                      my = event.clientY - button.offsetTop;
                
                  var w = button.offsetWidth,
                      h = button.offsetHeight;
                  
                  var directions = [
                    { id: 'top', x: w/2, y: 0 },
                    { id: 'right', x: w, y: h/2 },
                    { id: 'bottom', x: w/2, y: h },
                    { id: 'left', x: 0, y: h/2 }
                  ];
                  
                  directions.sort( function( a, b ) {
                    return distance( mx, my, a.x, a.y ) - distance( mx, my, b.x, b.y );
                  } );
                  scope.dataDirection = directions.shift().id;
                  // button.setAttribute( 'data-direction', directions.shift().id );
                  button.addClass( 'is-open' );
                


              }

              function mainFunction(){
               
                if(scope.condition == 'true'){
                  scope.ifTrueFunction();
                  scope.condition = 'false';
                  allocateByCondition()
                } else{
                  scope.ifFalseFunction();
                  scope.condition = 'true';
                  allocateByCondition()
                }
                button.removeClass( 'is-open' );
                
              }

              function cancelFunction(){
                button.removeClass( 'is-open' );
              }

              function allocateByCondition(){
                console.log(attrs)
                if(scope.condition == 'true'){
                  scope.actionName = attrs.ifTrueActionName;
                  scope.message = attrs.ifTrueActionMessage;
                } else{
                  scope.actionName = attrs.ifFalseActionName;
                  scope.message = attrs.ifFalseActionMessage;
                }
              }
              // btnFront.addEventListener( 'click', function( event ) {
              //   var mx = event.clientX - btn.offsetLeft,
              //       my = event.clientY - btn.offsetTop;
              
              //   var w = btn.offsetWidth,
              //       h = btn.offsetHeight;
                
              //   var directions = [
              //     { id: 'top', x: w/2, y: 0 },
              //     { id: 'right', x: w, y: h/2 },
              //     { id: 'bottom', x: w/2, y: h },
              //     { id: 'left', x: 0, y: h/2 }
              //   ];
                
              //   directions.sort( function( a, b ) {
              //     return distance( mx, my, a.x, a.y ) - distance( mx, my, b.x, b.y );
              //   } );
                
              //   btn.setAttribute( 'data-direction', directions.shift().id );
              //   btn.classList.add( 'is-open' );
              
              // } );
              
              // var btn = document.querySelector( '.btn' );

              // var btnFront = btn.querySelector( '.btn-front' ),
              //     btnYes = btn.querySelector( '.btn-back .yes' ),
              //     btnNo = btn.querySelector( '.btn-back .no' );
              
              // btnFront.addEventListener( 'click', function( event ) {
              //   var mx = event.clientX - btn.offsetLeft,
              //       my = event.clientY - btn.offsetTop;
              
              //   var w = btn.offsetWidth,
              //       h = btn.offsetHeight;
                
              //   var directions = [
              //     { id: 'top', x: w/2, y: 0 },
              //     { id: 'right', x: w, y: h/2 },
              //     { id: 'bottom', x: w/2, y: h },
              //     { id: 'left', x: 0, y: h/2 }
              //   ];
                
              //   directions.sort( function( a, b ) {
              //     return distance( mx, my, a.x, a.y ) - distance( mx, my, b.x, b.y );
              //   } );
                
              //   btn.setAttribute( 'data-direction', directions.shift().id );
              //   btn.classList.add( 'is-open' );
              
              // } );
              
              // btnYes.addEventListener( 'click', function( event ) {	
              //   btn.classList.remove( 'is-open' );
              //   scope.yesFunction();
              // } );
              
              // btnNo.addEventListener( 'click', function( event ) {
              //   btn.classList.remove( 'is-open' );
              // } );
              
              function distance( x1, y1, x2, y2 ) {
                var dx = x1-x2;
                var dy = y1-y2;
                return Math.sqrt( dx*dx + dy*dy );
              }
            }
        }
             
  
    }

    
  })();
  