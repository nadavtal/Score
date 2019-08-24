

;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('accountDirective', accountDirective);
  
    accountDirective.$inject = ['$q', '$injector', '$state'];
  
    function accountDirective($q, $injector, $state) {
        
        return {
            templateUrl: 'app/_shared/directives/accountDirective/accountDirective.htm',
            link: function (scope, element, attributes) {
                // console.log(scope)
                // console.log(attributes);
               

                
                scope.goTo = function(){
                    
                    if(scope.account.platform == 'Clash'){
                        // console.log('clicked')
                        // scope.link = 'clashUser({ usertag: '+scope.account.accountId+' })'
                        $state.go('clashUser({ usertag: '+scope.account.accountId+' })')
                        
                        
                    } else {
                        $state.go('displayAccount({accountId: '+scope.account._id+'})')
                    }
                }
            }
        };
  
      
  
    }
  })();
  