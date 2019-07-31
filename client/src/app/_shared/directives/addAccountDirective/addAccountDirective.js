;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('addAccountDirective', addAccountDirective);
  
      addAccountDirective.$inject = ['$q', '$rootScope', '$injector','accountsService','ngDialog', 'clashUserService', 'platformService'];
  
    function addAccountDirective($q, $rootScope, $injector, accountsService, ngDialog, clashUserService,platformService) {
        console.log('addAccountDirective');
        return {
            templateUrl: 'app/_shared/directives/addAccountDirective/addAccountDirective.htm',
            link: function (scope, element, attributes) {
                console.log(scope.ngDialogData);
                scope.platforms = scope.ngDialogData.platforms
                scope.account = {}
                scope.AddAccountForm = AddAccountForm;
                scope.clearSearchTerm = clearSearchTerm;
                scope.searchTerm = '';
                console.log(scope.platforms);
                if(!scope.ngDialogData.platforms){
                    platformService.getAllPlatformsFromDataBase()
                    .then((platforms) => {
                        scope.platforms = platforms.data.data;
                        
                        console.log(scope.platforms);
                        
                    })
                }
               
                  


                
                function AddAccountForm(account, userId){
                    if (!account) return;
                    account.userId = userId;
                    console.log(account)
                    console.log(account.platform)
                    clashUserService.getClashUser(account.accountId)
                        .then(function(user) {
                            console.log(user);
                            if(user.data.reason){
                            ngDialog.open({
                                template: '\
                                <p>cant find clash user with tag: '+ account.accountId +'</p>\
                                <div class=\"ngdialog-buttons\">\
                                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
                                </div>',
                                plain: true
                            });
                            } else if (user.data.name != account.userName){
                            ngDialog.open({
                                template: '\
                                <p>The name of this clash user is not '+ account.userName +'</p>\
                                <div class=\"ngdialog-buttons\">\
                                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
                                </div>',
                                plain: true
                            });
                            }
                            else {
                                accountsService.createAccount(account)
                                .then(function(newAccount) {
                                    scope.newAccount = newAccount.data.data;
                                    console.log(scope.newAccount)
                                    $log.debug('newAccount', scope.newAccount);
    
                                    var dialog = ngDialog.open({
                                        template: '\
                                        <p>New account created</p>\
                                        <div class="ngdialog-buttons">\
                                            <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'ok\')">OK</button>\
                                        </div>',
                                        plain: true
                                    });
    
                                    // dialog.closePromise.then(function(closedDialog) {
                                    //   $state.go('displayAccount', { accountId: vm.newAccount._id });
                                    // });
    
                                    })
                                    .catch(function(err) {
                                    $log.debug(err);
                                    });
                            
                                
                            
                            }
                            
                            
                    })
                    
                    
                }   
                
                function clearSearchTerm(){
                    scope.searchTerm = ''
                  }
                
                
                
                
            },
            
        };

        
  
      
  
    }
  })();
  