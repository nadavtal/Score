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
      .service('tournamentsService', tournamentsService);
  
      tournamentsService.$inject = ['$http', 'CONSTANTS', 'QueryService'];
  
    function tournamentsService($http, CONSTANTS, QueryService) {
      
      
    
      this.getTournament = getTournament;
      this.createTournament = createTournament
      this.checkIfTournamentExists = checkIfTournamentExists; 
      this.getAllTournamentsFromDataBase = getAllTournamentsFromDataBase;
      this.getTournamentsByUserID = getTournamentsByUserID;
      this.getTournamentsByGroupId = getTournamentsByGroupId;
      this.getTournamentsByPlatform = getTournamentsByPlatform 
      
  
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
      
      function getTournament(tournamentId) {
        if (!tournamentId) return;
  
        return QueryService
          .query('GET', 'tournaments/' + tournamentId, null, null)
      }
      function createTournament(tournament) {
        console.log(tournament)
        if (!tournament) return;
  
        return QueryService
          .query('POST', 'tournaments/', null, tournament)
      }

            
      function getAllTournamentsFromDataBase(){
        return QueryService.query('GET', 'tournaments/', null, null)
      }
  
      function getTournamentsByPlatform(platformName){
        return QueryService.query('GET', 'tournaments/platforms/'+platformName, null, null)
      }

      function getTournamentsByUserID(userId){
        return QueryService.query('GET', 'tournaments/user/'+userId, null, null)
      }
      function getTournamentsByGroupId(groupId){
        return QueryService.query('GET', 'tournaments/group/'+groupId, null, null)
      }
  
      function checkIfTournamentExists(tournament){
        var promise = new Promise((resolve, reject)=> {
          var tournamenttoUpaload = tournament
          getOneTournament(tournament.name)
          .then((tournament)=> {
            // console.log(tournament)
            if(tournament.data.name){
              console.log('inDB')
              resolve(false)
            } else{
              resolve(tournamenttoUpaload)
            }
          })
        })
        
        return promise  
      }
  
      
  
      
  
      
  
    }
  
  })();
  