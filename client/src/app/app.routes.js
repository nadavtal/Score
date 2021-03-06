;(function() {

  'use strict';

  /**
   * App routes
   */
  angular.module('boilerplate')
    .config(RoutingConfig);

  RoutingConfig.$inject = ['$urlRouterProvider', '$stateProvider'];

  function RoutingConfig($urlRouterProvider, $stateProvider) {
    
    // for any unmatched url, redirect to /
    $urlRouterProvider.otherwise('/');

    // now set up the states
    $stateProvider

      
      .state('home', {
        url: '/',
        component: 'home',
        
      })
      .state('admin', {
        url: '/admin',
        component: 'admin',
        
      })
      //USERS STATES
      .state('users', {
        url: '/users',
        component: 'userList',
        
      })
      .state('changePassword', {
        url: '/users/change-password',
        component: 'changePassword',
        // role: 'admin' // accessible only for admin roles
      })

      .state('createUser', {
        url: '/users/create',
        component: 'user',
        // role: 'admin' // accessible only for admin roles
      })

      .state('editUser', {
        url: '/users/:userId/edit',
        component: 'user',
        // role: 'admin' // accessible only for admin roles
      })

      .state('displayUser', {
        url: '/users/:userId',
        component: 'user',
        // role: 'admin' // accessible only for admin roles
      })
      //CLASH STATES
      .state('clashUsers', {
        url: '/clashusers',
        component: 'clashUsers',
        
      })

      .state('clashUser', {
        url: '/clashusers/:usertag',
        component: 'clashUser',
        
      })

      .state('clashClans', {
        url: '/clashclans',
        component: 'clanList',
        
      })

      .state('clashClan', {
        url: '/clashclans/:clantag',
        component: 'clan',
        
      })
      //GAMES STATES
      .state('games', {
        url: '/games',
        component: 'gameList',
        
      })
      .state('gamesByUserId', {
        url: '/games/user/:userId',
        component: 'gameList',
        // role: 'admin' // accessible only for admin roles
      })

      .state('createGame', {
        url: '/games/create',
        component: 'game',
        // role: 'admin' // accessible only for admin roles
      })

      
      .state('displayGame', {
        url: '/games/:gameId',
        component: 'game',
        // role: 'admin' // accessible only for admin roles
      })
      
      .state('registerToGame', {
        url: '/games/:gameId/register',
        component: 'game',
        // role: 'admin' // accessible only for admin roles
      })

      .state('editGame', {
        url: '/games/:gameId/edit',
        component: 'game',
        // role: 'admin' // accessible only for admin roles
      })


      //GROUP STATES
      .state('groups', {
        url: '/groups',
        component: 'groupList',
        
      })

      .state('createGroup', {
        url: '/groups/create',
        component: 'group',
        // role: 'admin' // accessible only for admin roles
      })

      .state('displayGroup', {
        url: '/groups/:groupId',
        component: 'group',
        // role: 'admin' // accessible only for admin roles
      })

      .state('registerToGroup', {
        url: '/groups/:groupId/register',
        component: 'group',
        // role: 'admin' // accessible only for admin roles
      })

      .state('editGroup', {
        url: '/groups/:groupId/edit',
        component: 'group',
        // role: 'admin' // accessible only for admin roles
      })
      .state('createGroupGame', {
        url: '/groups/:groupId/createGame',
        component: 'game',
        // role: 'admin' // accessible only for admin roles
      })
      .state('createGroupTournament', {
        url: '/groups/:groupId/createTournament',
        component: 'tournament',
        // role: 'admin' // accessible only for admin roles
      })
      
      //ACCOUNTS STATES
      .state('displayAccount', {
        url: '/accounts/:_id',
        component: 'account',
        // role: 'admin' // accessible only for admin roles


      //TOURNAMENTS STATES
      })
      .state('tournaments', {
        url: '/tournaments',
        component: 'tournamentList',
        // role: 'admin' // accessible only for admin roles
      })
      .state('createTournament', {
        url: '/tournaments/create',
        component: 'tournament',
        // role: 'admin' // accessible only for admin roles
      })

      .state('editTournament', {
        url: '/tournaments/:tournamentId/edit',
        component: 'tournament',
        // role: 'admin' // accessible only for admin roles
      })

      .state('displayTournament', {
        url: '/tournaments/:tournamentId',
        component: 'tournament',
      })
      

      
      

  }

})();
