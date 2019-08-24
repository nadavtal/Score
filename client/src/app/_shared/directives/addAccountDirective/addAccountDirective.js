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
  
      addAccountDirective.$inject = ['$q', '$state', '$injector','accountsService','ngDialog', 'clashUserService', 'platformService', '$log'];
  
    function addAccountDirective($q, $state, $injector, accountsService, ngDialog, clashUserService,platformService, $log) {
        console.log('addAccountDirective');
        return {
            templateUrl: 'app/_shared/directives/addAccountDirective/addAccountDirective.htm',
            link: function (scope, element, attributes) {
                console.log(scope.ngDialogData);
                scope.platforms = scope.ngDialogData.platforms
                scope.userId = scope.ngDialogData.userId
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
               
                  


                
                function AddAccountForm(account){
                    if (!account) return;
                    account.userId = scope.userId;
                    console.log('account before created: ', account)
                    // console.log(account.platform);
                    if(account.platform == 'Clash'){
                        clashUserService.getClashUser(account.accountId)
                        .then(function(user) {
                            console.log(user);
                            if(user.data.reason){
                                Swal.fire({
                                    position: 'center',
                                    type: 'success',
                                    title: 'cant find clash user with tag: '+ account.accountId,
                                    showConfirmButton: false,
                                    timer: 1200
                                  });
                            // ngDialog.open({
                            //     template: '\
                            //     <p>cant find clash user with tag: '+ account.accountId +'</p>\
                            //     <div class=\"ngdialog-buttons\">\
                            //         <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
                            //     </div>',
                            //     plain: true
                            // });
                            } else if (user.data.name != account.userName){
                            Swal.fire({
                                position: 'center',
                                type: 'success',
                                title: 'The name of this clash user is not '+ account.userName ,
                                showConfirmButton: false,
                                timer: 1500
                                });
                            // ngDialog.open({
                            //     template: '\
                            //     <p>The name of this clash user is not '+ account.userName +'</p>\
                            //     <div class=\"ngdialog-buttons\">\
                            //         <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
                            //     </div>',
                            //     plain: true
                            // });
                            }
                            else {
                                accountsService.createAccount(account)
                                .then(function(newAccount) {
                                    scope.newAccount = newAccount.data.data;
                                    console.log(scope.newAccount)
                                    $log.debug('newAccount', scope.newAccount);
                                    Swal.fire({
                                        position: 'center',
                                        type: 'success',
                                        title: 'New account created',
                                        showConfirmButton: false,
                                        timer: 1200
                                      });
                                    // var dialog = ngDialog.open({
                                    //     template: '\
                                    //     <p>New account created</p>\
                                    //     <div class="ngdialog-buttons">\
                                    //         <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'ok\')">OK</button>\
                                    //     </div>',
                                    //     plain: true
                                    // });
    
                                    // dialog.closePromise.then(function(closedDialog) {
                                    //   $state.go('displayAccount', { accountId: vm.newAccount._id });
                                    // });
    
                                    })
                                    .catch(function(err) {
                                    $log.debug(err);
                                    });
                            
                                
                            
                            }
                            
                            
                    })
                    } else{
                        accountsService.createAccount(account)
                            .then(function(newAccount) {
                                scope.newAccount = newAccount.data.data;
                                console.log(scope.newAccount)
                                $log.debug('newAccount', scope.newAccount);

                                Swal.fire({
                                    position: 'center',
                                    type: 'success',
                                    title: 'New account created',
                                    showConfirmButton: false,
                                    timer: 1200
                                  });
                                // var dialog = ngDialog.open({
                                //     template: '\
                                //     <p>New account created</p>\
                                //     <div class="ngdialog-buttons">\
                                //         <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'ok\')">OK</button>\
                                //     </div>',
                                //     plain: true
                                // });

                                // dialog.closePromise.then(function(closedDialog) {
                                  $state.go('accountList', { accountId: scope.newAccount.userId });
                                // });

                                })
                                .catch(function(err) {
                                $log.debug(err);
                                });
                            
                    }
                   
                    
                    
                }   
                
                function clearSearchTerm(){
                    scope.searchTerm = ''
                  }
                
                
                
                
            },
            
        };

        
  
      
  
    }
  })();
  