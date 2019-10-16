;(function() {

  'use strict';

  /**
   * API Router
   */
  var express = require('express');
  var router = express.Router();
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var mongoose = require('mongoose');
  var ENV = process.env.NODE_ENV || 'development';
  var config = require('../config/config');
  var DB_URI = config.db[ENV].url;
  const path = require('path');
  const crypto = require('crypto');
  const multer = require('multer');
  const GridFsStorage = require('multer-gridfs-storage');
  const Grid = require('gridfs-stream');
  const methodOverride = require('method-override');

  var conn = mongoose.createConnection(DB_URI);
  mongoose.connection.on('connected', () => {
    // console.log(`Mongoosesssssssss connected to`);

    //Init stream
    var gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');

    //Create storage engine
    const storage = new GridFsStorage({
      url: DB_URI,
      file: (req, file) => {
        // console.log(req)
        return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
            if (err) {
              return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
              filename: filename,
              bucketName: 'uploads'
            };
            resolve(fileInfo);
          });
        });
      }
    });
    const upload = multer({ storage });
    router.post('/uploads', upload.single('file'), uploadsCtrl.uploadImage);
    router.get('/files', (req,res) => {
      gfs.files.find().toArray((err, files) => {
        //check if files
        if(!files || files.lengh === 0) {
          return res.status(404).json({
            err: 'no files exist'
          });

        }
        return res.json(files)
      });
    });

    router.get('/files/:filename', (req,res) => {
      
      gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        if(!file || file.lengh === 0) {
          return res.status(404).json({
            err: 'no file exist'
          });

        }
        return res.json(file)
      })
    });
    //getImage and display
    router.get('/image/:filename', (req, res) => {
      gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
          return res.status(404).json({
            err: 'No file exists'
          });
        }
    
        // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
          // Read output to browser
          const readstream = gfs.createReadStream(file.filename);
          // console.log(readstream)
          readstream.pipe(res);
        } else {
          res.status(404).json({
            err: 'Not an image'
          });
        }
      });
    });
  });




  // controllers
  var usersCtrl = require('./user/users.controller.js');
  var gamesCtrl = require('./game/game.controller.js');
  var tournamentsCtrl = require('./tournament/tournament.controller.js');
  var groupsCtrl = require('./group/group.controller.js');
  var clanCtrl = require('./clan/clan.controller.js');
  var clashUserCtrl = require('./clashUser/clashuser.controller.js');
  var platformsCtrl = require('./platform/platform.controller.js');
  var accountsCtrl = require('./account/account.controller.js');
  var messagesCtrl = require('./message/message.controller.js');
  var gameTypesCtrl = require('./gametype/gameType.controller.js');
  var platformTypesCtrl = require('./platformtype/platformType.controller.js');
  var uploadsCtrl = require('./updoads/updoads.controller.js');
  var battlesCtrl = require('./battle/battle.controller');

  /**
   * uploads
   */
  router.get('/uploads', uploadsCtrl.getUploads); // get all uploads
  router.get('/uploads/:userId', uploadsCtrl.getUploadsByUserId); // get uploads by userId
  
  // router.get('/clashusers/:clantag/:usertag', clashUserCtrl.getClashPlayer); // get clash clan
  router.get('/clashusers/:usertag/battles', clashUserCtrl.getUserBattlesFromClashApi); // get clash user battles
  router.get('/clashusers/:usertag', clashUserCtrl.getClashPlayer); // get clash clan
  router.put('/clashusers/:usertag', clashUserCtrl.updateClashUser); // create clash user
  router.get('/clashusers', clashUserCtrl.getClashUsersFromDatabase); // get clash users
  router.post('/clashusers', clashUserCtrl.createUser); // create clash user
  /**
   * ClashClans
   */
  router.get('/clashRoyalclans', clanCtrl.getClansFromDatabase); // get clash users
  router.post('/clashRoyalclans', clanCtrl.createClan); // get clash clan
  router.get('/clashRoyalclans/:clanId', clanCtrl.getClashRoyalClan); // get clash clan
  router.post('/clashRoyalclans/:clanId', clanCtrl.updateClan); // update Clan
  router.get('/clashRoyalclans/:clanId/:userId', clanCtrl.getClashRoyalClanFromClashApi); // get clash clan
  /**
   * FriendlyBattles
   */
  router.get('/friendlybattles/', clanCtrl.getAllFriendlyBattles); // get clash clan
  router.get('/friendlybattles/:battleTime/:clanTag', clanCtrl.getBattle); // get clash clan
  
  /**
   * Users
   */
  router.post('/users/authenticate', usersCtrl.authenticate); // authenticate user
  router.post('/users', usersCtrl.createUser); // create new user
  router.get('/users/', usersCtrl.verifyToken, /*usersCtrl.isAdmin,*/ usersCtrl.getUsers); // get all users (uncomment usersCtrl.isAdmin if the route should work only for admin roles)
  router.put('/users/change-password', usersCtrl.verifyToken, usersCtrl.changePassword); // change password
  router.get('/users/:userId', usersCtrl.verifyToken, usersCtrl.getUser); // get user
  
  router.get('/users/:userId/groups', usersCtrl.verifyToken, groupsCtrl.getGroupsByUserId); // get groups by user
  router.get('/users/:userId/groups/managed', groupsCtrl.getGroupsManagedByUserId); // update group

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
   * Battles
   */
  router.get('/battles', battlesCtrl.getAllBattles); // get all battles
  // router.post('/battles/:platform', battlesCtrl.createBattle); // get all battles
  router.get('/battles/:clanTag', battlesCtrl.getBattlesByClanTag); // get battles by clanTag 
  router.post('/battles/:clanTag', clanCtrl.createFriendlyBattle); // get battles by clanTag 
 

    /**
   * Tournaments
   */
  router.post('/tournaments', tournamentsCtrl.createTournament); // create new game
  router.get('/tournaments/', tournamentsCtrl.getAllTournaments); // get all tournaments
  router.get('/tournaments/:tournamentId', tournamentsCtrl.getTournament); // get game
  router.put('/tournaments/:tournamentId', tournamentsCtrl.updateTournament); // update game
  router.post('/tournaments/:tournamentId', tournamentsCtrl.removeTournament); // remove game
  router.get('/tournaments/user/:userId', tournamentsCtrl.getTournamentsByUserId); // get tournaments by user
  router.get('/tournaments/user/managed/:userName', tournamentsCtrl.getTournamentsManagedByUserName); // get tournaments by user
  router.get('/tournaments/group/:groupId', tournamentsCtrl.getTournamentsByGroupId); // get tournaments by group
  router.get('/tournaments/platforms/:platformName', tournamentsCtrl.getTournamentsByplatformName); // get tournaments by group
  router.get('/tournaments/buyin/:min/:max', tournamentsCtrl.getTournamentsByBuyin); // get tournaments by group
  router.get('/tournaments/maxplayers/:min/:max', tournamentsCtrl.getTournamentsByNumPlayers); // get tournaments by group
  router.get('/tournaments/prizepool/:min/:max', tournamentsCtrl.getTournamentsByPrizePool); // get tournaments by group
  router.get('/tournaments/time/:date/:operator', tournamentsCtrl.getTournamentsBytime); // get tournaments by group

  /**
   * Groups
   */
  router.post('/groups', groupsCtrl.createGroup); // create new Group
  router.get('/groups/', groupsCtrl.getAllGroups); // get all games
  router.get('/groups/:groupId', groupsCtrl.getGroup); // get group
  router.post('/groups/:groupId', groupsCtrl.removeGroup); // get group
  router.put('/groups/:groupId', groupsCtrl.updateGroup); // update group
  // router.put('/groups/user/managed/:userId', groupsCtrl.getGroupsManagedByUserId); // update group

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
  router.put('/messages/:messageId', messagesCtrl.updateMessage); // create new Message
  router.get('/messages/', messagesCtrl.getAllMessages); // get all messages
  router.get('/messages/user/:userId', messagesCtrl.getMessagesByUserID); // get all messages
  router.get('/messages/group/:groupId', messagesCtrl.getMessagesByGroupId); // get all messages
  

   /**
   * Accounts
   */
  router.post('/accounts', accountsCtrl.createAccount); // create new Account
  router.get('/accounts', accountsCtrl.getAllAccounts); // get all accounts
  router.get('/accounts/users/:userId', accountsCtrl.getAccountsByUserId); // get accounts by userid
  router.get('/accounts/:accountId', accountsCtrl.getAccount); // get accounts by id
  router.put('/accounts/:accountId', accountsCtrl.updateAccount); // update account
  router.get('/accounts/platforms/:name', accountsCtrl.getAccountsByPlatformName); // get accounts by userid

  module.exports = router;

})();
