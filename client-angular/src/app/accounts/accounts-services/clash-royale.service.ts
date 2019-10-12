import { Injectable } from '@angular/core';
import { QueryService } from 'src/app/shared/services/query.service';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ClashRoyaleService {
    constructor(private query:QueryService){}
    clashUser = new Subject<any>()
    clashClan = new Subject<any>()

    //CLASH USER API
    getClashUser(usertag) {
    if (!usertag) return;
    var reparedUserId = '%23'+ usertag.slice(1, usertag.length)
    return this.query.get('clashusers/'+reparedUserId)

    }
  
    getClashUserFromDb(usertag) {
    if (!usertag) return;
    console.log(usertag);
    var reparedUserId = '%23'+ usertag.slice(1, usertag.length)
    return this.query.get('clashusers/'+reparedUserId+'/battles')

    }
    getClashUserBattles(userTag) {
    // console.log('alksdlaksjdlakjsdd')
    var reparedUserId = '%23'+ userTag.slice(1, userTag.length)
    if (!reparedUserId) return;
    return this.query.get('clashusers/'+reparedUserId+'/battles')

    }

    getAllClashUsers(){
    return this.query.get('clashusers/')
    }

     //CLASH CLAN API
     getClan(clanId){
        var reparedUserId = '%23'+ clanId.slice(1, clanId.length)
        return this.query.get('clashclans/'+reparedUserId)
      };

      getClansFromDatabase(){
        
        return this.query.get('clashclans')
      }
  
  
      getClanAndBattles(clanId) {
        var promise = new Promise(function(resolve, reject){
          this.getClan(clanId)
          .then((clan) =>{
            // console.log(clan)
            this.getAllBattlesByClan(clan)
            .then(function(values) {
                  // console.log(values);
                  resolve(values)
              });
          })
        });
        return promise
          
      };
  
      getAllBattlesByClan(clan){
        var promiseArr = [];
            for (var i = 0; i < clan.data.memberList.length; i++) {
                var promise = new Promise(function(resolve, reject) {
                  
                  var reparedUserId = '%23'+ clan.data.memberList[i].tag.slice(1, clan.data.memberList[i].tag.length)
          
                    this.query.get('clashusers/'+reparedUserId+'/battles')
                    .then(function(battles:any) {
                      console.log('got battles of player: ', clan.data.memberList[i].tag );
                      resolve(battles)
                    })
                    
                });
                promiseArr.push(promise);
            }
            // console.log(promiseArr)
            return Promise.all(promiseArr);
      }
  
      getFriendlyBattlesByClan(clanId){
        var promise = new Promise((resolve, reject) =>{
          var friendlyBattles = []
          this.getClanAndBattles(clanId)
          .then(function(data:any){
            // console.log(data);
            for(var i = 0; i<data.length; i++){
              this.findFriendlyBattles(data[i].data)
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
  
      findFriendlyBattles(array){
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
  
      addBattleToDB(battle){
          // var promise = new Promise((resolve, reject) => {
            var clanid = battle.team[0].clan.tag;
            
            var reparedUserId = '%23'+ clanid.slice(1, clanid.length)
            // console.log(clanid, reparedUserId)
            return this.query.post('clashclans/'+reparedUserId, battle)
          }
            
          
      
  
      getAllBattlesFromDataBase(){
        return this.query.get('friendlybattles/')
      }
  
      getOneBattle(time){
        return this.query.get('friendlybattles/'+time)
      }
  
      checkIfBattleExists(battle){
        var promise = new Promise((resolve, reject)=> {
          var battletoUpaload = battle
          this.getOneBattle(battle.battleTime)
          .subscribe((battle:any)=> {
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
  
      
}