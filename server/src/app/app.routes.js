;(function() {

  'use strict';

  /**
   * API Router
   */
  var express = require('express');
  var router = express.Router();

  // controllers
  var usersCtrl = require('./user/users.controller.js');
  var gamesCtrl = require('./game/game.controller.js');
  var groupsCtrl = require('./group/group.controller.js');
  var clanCtrl = require('./clan/clan.controller.js');
  var clashUserCtrl = require('./clashUSer/clashUSer.controller.js');
  var platformsCtrl = require('./platform/platform.controller.js');
  var accountsCtrl = require('./account/account.controller.js');
  var messagesCtrl = require('./message/message.controller.js');
  var gameTypesCtrl = require('./gameType/gameType.controller.js');
  var platformTypesCtrl = require('./platformType/platformType.controller.js');
  
  // router.get('/clashusers/:clantag/:usertag', clashUserCtrl.getClashPlayer); // get clash clan
  router.get('/clashusers/:userId/battles', clashUserCtrl.getClashPlayerBattles); // get clash user battles
  router.get('/clashusers/:userId', clashUserCtrl.getClashPlayer); // get clash clan
  router.get('/clashusers', clashUserCtrl.getClashUsersFromDatabase); // get clash users
  router.post('/clashusers', clashUserCtrl.createUser); // get clash users
  /**
   * ClashClans
   */
  router.get('/clashclans', clanCtrl.getClansFromDatabase); // get clash users
  router.post('/clashclans', clanCtrl.createClan); // get clash clan
  router.get('/clashclans/:clanId', clanCtrl.getClashClan); // get clash clan
  router.post('/clashclans/:clanId', clanCtrl.createFriendlyBattle); // create Friendly Battle
  router.get('/clashclans/:clanId/:userId', clanCtrl.getClashClan); // get clash clan
  /**
   * FriendlyBattles
   */
  router.get('/friendlybattles/', clanCtrl.getAllFriendlyBattles); // get clash clan
  router.get('/friendlybattles/:battleTime', clanCtrl.getBattle); // get clash clan
  
  /**
   * Users
   */
  router.post('/users/authenticate', usersCtrl.authenticate); // authenticate user
  router.post('/users', usersCtrl.createUser); // create new user
  router.get('/users/', usersCtrl.verifyToken, /*usersCtrl.isAdmin,*/ usersCtrl.getUsers); // get all users (uncomment usersCtrl.isAdmin if the route should work only for admin roles)
  router.put('/users/change-password', usersCtrl.verifyToken, usersCtrl.changePassword); // change password
  router.get('/users/:userId', usersCtrl.verifyToken, usersCtrl.getUser); // get user
  
  router.get('/users/:userId/groups', usersCtrl.verifyToken, groupsCtrl.getGroupsByUserId); // get groups by user
  router.put('/users/:userId', usersCtrl.verifyToken, usersCtrl.updateUser); // update user
  /**
   * Games
   */
  router.post('/games', gamesCtrl.createGame); // create new game
  router.get('/games/', gamesCtrl.getAllGames); // get all games
  router.get('/games/:gameId', gamesCtrl.getGame); // get game
  router.put('/games/:gameId', gamesCtrl.updateGame); // update game
  router.post('/games/:gameId', gamesCtrl.removeGame); // remove game
  router.get('/games/user/:userId', gamesCtrl.getGamesByUserId); // get games by user
  router.get('/games/group/:groupId', gamesCtrl.getGamesByGroupId); // get games by group
  /**
   * Groups
   */
  router.post('/groups', groupsCtrl.createGroup); // create new Group
  router.get('/groups/', groupsCtrl.getAllGroups); // get all games
  router.get('/groups/:groupId', groupsCtrl.getGroup); // get group
  router.put('/groups/:groupId', groupsCtrl.updateGroup); // update group

  /**
   * Platforms
   */
  router.post('/platforms', platformsCtrl.createPlatform); // create new Group
  router.get('/platforms/', platformsCtrl.getAllPlatforms); // get all games
 /**
   * Platform Types
   */
  router.post('/platformTypes', platformTypesCtrl.createPlatformType); // create new platformType
  router.get('/platformTypes/', platformTypesCtrl.getAllPlatformTypes); // get all platformTypes
   /**
   * GameTypes
   */
  router.post('/gameTypes', gameTypesCtrl.createGameType); // create new GameType
  router.get('/gameTypes/', gameTypesCtrl.getAllGameTypes); // get all gamesTypes

  /**
   * Messages
   */
  router.post('/messages', messagesCtrl.createMessage); // create new Message
  router.get('/messages/', messagesCtrl.getAllMessages); // get all messages
  router.get('/messages/user/:userId', messagesCtrl.getMessagesByUserID); // get all messages


   /**
   * Accounts
   */
  router.post('/accounts', accountsCtrl.createAccount); // create new Account
  router.get('/accounts', accountsCtrl.getAllAccounts); // get all accounts
  router.get('/accounts/:userId', accountsCtrl.getAccountsByUserId); // get accounts by userid
  router.get('/accounts/platforms/:name', accountsCtrl.getAccountsByPlatformName); // get accounts by userid

  module.exports = router;

})();
