

;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('chatDirective', chatDirective);
  
    chatDirective.$inject = ['$q', '$injector', 'groupsService', '$log', 'socket'];
  
    function chatDirective($q, $injector, groupsService, $log, socket) {
        
        return {
            templateUrl: 'app/_shared/directives/chatDirective/chatDirective.htm',
            link: function (scope, element, attributes) {
                // console.log(scope)
                // console.log(attributes);
                scope.messages = [];
                scope.status = '';
                scope.message = '';
                scope.chatOpen = false
                scope.showLines = false
                scope.statusColor = 'green'

                groupsService.getGroupsByUserID(scope.vm.currentUser._id)
                    .then(function(groups) {
                        // console.log(groups)
                        
                        scope.groups = groups.data.data;
                        console.log('groups', scope.groups)
                        $log.debug('groups', scope.groups);
                    })
                    .catch(function(err) {
                        $log.debug(err);
                    });
                var statusDefault = '';
                var setStatus = function(s){
                    // Set status
                    scope.status = s;
                    // scope.$apply()
                    if(s !== statusDefault){
                        // console.log(statusDefault)
                        var delay = setTimeout(function(){
                            setStatus(statusDefault);
                            scope.$apply()
                        }, 3000);
                    }
                }

                socket.on('messages', function(data){
                    console.log(data);
                    scope.messages = data;
                    scope.showLines = true;
                    // console.log(scope.messages);
                    // scope.$apply();
                    
                });
                socket.on('output', function(data){
                    console.log(data);
                    scope.messages.push(data);
                    
                    // scope.$apply();
                });

                socket.on('status', function(data){
                        
                        
                        setStatus((typeof data === 'object')? data.message : data);
                        // If status is clear, clear text
                        if(data.clear){
                            scope.message = '';
                        }
                    });


                scope.chatWith = function(user){
                    scope.user = user;
                    // socket2.emit('userLoggedIn', {
                    //     currentUser: scope.vm.currentUser,
                    //     user: scope.user
                        
                    // });
                    socket.emit('userLoggedIn', {
                        currentUser: scope.vm.currentUser,
                        user: scope.user
                        
                    });
                }

                scope.chatWithGroup = function(group){
                    scope.group = group;
                    // socket2.emit('userLoggedIn', {
                    //     currentUser: scope.vm.currentUser,
                    //     user: scope.user
                        
                    // });
                    socket.emit('groupLoggedIn', {
                        currentUser: scope.vm.currentUser,
                        group: scope.group
                        
                    });
                }

                
                scope.sendMessage = function(msg){
                    scope.message = msg;
                    console.log(scope.message);
                    if(scope.group){
                        socket.emit('input', {
                            message: scope.message,
                            messageType: 'groupChatMessage',
                            sender:{ userName: scope.vm.currentUser.userName,
                                     userId: scope.vm.currentUser._id},
                            receiver: {userName: scope.group.groupName,
                                       userId: scope.group._id
                                     },
                            
                        });
                    } else if (scope.user){
                        socket.emit('input', {
                            message: scope.message,
                            messageType: 'privateChatMessage',
                            sender:{ userName: scope.vm.currentUser.userName,
                                     userId: scope.vm.currentUser._id},
                            receiver: {userName: scope.user.userName,
                                       userId: scope.user.userId
                                     },
                            
                        });
                    } else {
                        scope.statusColor = 'red'
                        scope.status = 'please pick some one to chat with'
                    }
                    
                }

                scope.toggleChat = function(){
                    console.log(scope.chatOpen)
                    if (scope.chatOpen == true) scope.chatOpen = false;
                    else scope.chatOpen = true;
                    // scope.$apply();
                }

                scope.sendTypingStatus = function(){
                    socket.emit('typing', {
                       user: scope.vm.currentUser
                    });
                }

                // Connect to socket.io
                // console.log(io)
                // var socket2 = io.connect('http://localhost:5000');
                // Check for connection
                // if(socket2 !== undefined){
                //     console.log('Connected to socket2...');
                    

                //     // Handle Output
                //     socket2.on('messages', function(data){
                //         console.log(data);
                //         scope.messages = data;
                //         scope.showLines = true;
                //         // console.log(scope.messages);
                //         scope.$apply();
                       
                //     });

                //     socket2.on('output', function(data){
                //         console.log(data);
                //         scope.messages.push(data);
                        
                //         scope.$apply();
                //     });

                //     // Get Status From Server
                //     socket2.on('status', function(data){
                //         // get message status
                //         setStatus((typeof data === 'object')? data.message : data);
                //         // If status is clear, clear text
                //         if(data.clear){
                //             scope.message = '';
                //         }
                //     });
                //     // Handle Input
                //     // textarea.addEventListener('keydown', function(event){
                //     //     if(event.which === 13 && event.shiftKey == false){
                //     //         // Emit to server input
                //     //         socket.emit('input', {
                //     //             name:username.value,
                //     //             message:textarea.value
                //     //         });
                //     //         event.preventDefault();
                //     //     }
                //     // })
                //     // Handle Chat Clear
                    
                // }

                


                
            }
        };
  
      
  
    }
  })();
  