;(function() {

  'use strict';

  /**
   * $http service abstraction to make API calls with any HTTP method,
   * custom url, and params.
   *
   * @category  service
   * @author    Jozef Butko
   * @example   Inject QueryService as the dependency and then use it this way:
   *
   * 
   *
   */

  angular
    .module('boilerplate')
    .service('clanService', clanService);

    clanService.$inject = ['$http', 'CONSTANTS', 'QueryService'];

  function clanService($http, CONSTANTS, QueryService) {
    this.getClanAndBattles = getClanAndBattles;
    this.getAllBattlesByClan = getAllBattlesByClan;
    this.findFriendlyBattles = findFriendlyBattles;
    this.getClan = getClan;
    this.getFriendlyBattlesByClan = getFriendlyBattlesByClan;
    this.addBattleToDB = addBattleToDB;
    this.getAllBattlesFromDataBase = getAllBattlesFromDataBase;
    this.getOneBattle = getOneBattle;
    this.checkIfBattleExists = checkIfBattleExists; 
    this.getClansFromDatabase = getClansFromDatabase   
    

    /// definitions

    /**
     * Make http request of any method with params
     * @param  {string} method     HTTP method
     * @param  {styring} url       URL
     * @param  {object} getParams  GET params in case of GET request
     * @param  {object} postParams POST/PUT params in case of POST/PUT requests
     * @param  {object} headers    Headers
     * @return {object}            Promise
     */
    function getClan(clanId){
      var reparedUserId = '%23'+ clanId.slice(1, clanId.length)
      return QueryService.query('GET', 'clashclans/'+reparedUserId, null, null)
    }


    function getClanAndBattles(clanId) {
      var promise = new Promise(function(resolve, reject){
        getClan(clanId)
        .then((clan) =>{
          // console.log(clan)
          getAllBattlesByClan(clan)
          .then(function(values) {
                // console.log(values);
                resolve(values)
            });
        })
      });
      return promise
        
    };

    function getAllBattlesByClan(clan){
      var promiseArr = [];
          for (var i = 0; i < clan.data.memberList.length; i++) {
              var promise = new Promise(function(resolve, reject) {
                
                var reparedUserId = '%23'+ clan.data.memberList[i].tag.slice(1, clan.data.memberList[i].tag.length)
        
                  QueryService
                  .query('GET', 'clashusers/'+reparedUserId+'/battles', null, null)
                  .then(function(battles) {
                    console.log('got battles of player');
                    resolve(battles)
                  })
                  
              });
              promiseArr.push(promise);
          }
          // console.log(promiseArr)
          return Promise.all(promiseArr);
    }

    function getFriendlyBattlesByClan(clanId){
      var promise = new Promise((resolve, reject) =>{
        var friendlyBattles = []
        getClanAndBattles(clanId)
        .then(function(data){
          // console.log(data);
          for(var i = 0; i<data.length; i++){
            findFriendlyBattles(data[i].data)
            .then((battles)=>{
              for(var j = 0; j<battles.length; j++){
                friendlyBattles.push(battles[j])
              }
              resolve(friendlyBattles)
            })
          }
          
        });
      })
      return promise
    }

    function findFriendlyBattles(array){
      var promise = new Promise((resolve, reject)=> {
        var battles = []
        for (var j = 0; j < array.length; j++) {
          // console.log(array[j])                 
          if(array[j].type == 'friendly'){
            // console.log('foundfriendlyBattle', array[j]);
            battles.push(array[j])
            
            
          }
        }
        resolve(battles)
        
        
      })
      return promise
      
    }

    function addBattleToDB(battle){
        // var promise = new Promise((resolve, reject) => {
          var clanid = battle.team[0].clan.tag;
          
          var reparedUserId = '%23'+ clanid.slice(1, clanid.length)
          // console.log(clanid, reparedUserId)
          return QueryService.query('POST', 'clashclans/'+reparedUserId, null, battle)
        }
          
        
    

    function getAllBattlesFromDataBase(){
      return QueryService.query('GET', 'friendlybattles/', null, null)
    }

    function getOneBattle(time){
      return QueryService.query('GET', 'friendlybattles/'+time, null, null)
    }

    function checkIfBattleExists(battle){
      var promise = new Promise((resolve, reject)=> {
        var battletoUpaload = battle
        getOneBattle(battle.battleTime)
        .then((battle)=> {
          // console.log(battle)
          if(battle.data.battleTime){
            // console.log('inDB')
            resolve(false)
          } else{
            resolve(battletoUpaload)
          }
        })
      })
      
      return promise  
    }

    function getClansFromDatabase(){
      return QueryService.query('Get', 'clashclans/', null, null)
    }

    

    

  }

})();
