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
    getClashRoyalClanFromClashApi(clanTag){
      var reparedUserId = '%23'+ clanTag.slice(1, clanTag.length)
      return this.query.get('clashRoyalclans/'+reparedUserId)
    };

    getClashRoyalClan(clanTag){
      var reparedUserId = '%23'+ clanTag.slice(1, clanTag.length)
      return this.query.get('clashRoyalclans/'+reparedUserId)
    };

    getClansFromDatabase(){
      
      return this.query.get('clashRoyalclans')
    }


    getClanAndBattles(clanTag) {
      var self = this;
      var promise = new Promise(function(resolve, reject){
        self.getClashRoyalClan(clanTag)
        .subscribe((clan:any) =>{
          // console.log(clan)
          self.getAllBattlesByClan(clan.data.clanFromClashApi)
          .then(function(values) {
                // console.log(values);
                resolve(values)
            });
        })
      });
      return promise
        
    };

    getAllBattlesByClan(clan:any){
      var self = this;
      var promiseArr = [];
          for (var i = 0; i < clan.memberList.length; i++) {
              var promise = new Promise(function(resolve, reject) {
                
                var reparedUserId = '%23'+ clan.memberList[i].tag.slice(1, clan.memberList[i].tag.length)
        
                self.query.get('clashusers/'+reparedUserId+'/battles')
                  .subscribe(function(battles:any) {
                    // console.log(battles);
                    resolve(battles)
                  }, function(error){
                    reject(error)
                  })
                  
              });
              promiseArr.push(promise);
          }
          // console.log(promiseArr)
          return Promise.all(promiseArr);
    }

    getBattlesByTypeAndClanFromClashApi(clanId, type:string){
      var self = this;
      var promise = new Promise((resolve, reject) =>{
        var foundBattles = []
        self.getClanAndBattles(clanId)
        .then(function(battlesPerClanMember:any){
          console.log(battlesPerClanMember);
          for(var i = 0; i<battlesPerClanMember.length; i++){
            self.findBattlesByType(type, battlesPerClanMember[i])
            .then((battles:any)=>{
              for(var j = 0; j<battles.length; j++){
                foundBattles.push(battles[j])
              }
              resolve(foundBattles)
            })
          }
          
        });
      })
      return promise
    }

    findBattlesByType(type:string, array:any[]){
      var promise = new Promise((resolve, reject)=> {
        var battles = []
        for (var j = 0; j < array.length; j++) {
          // console.log(array[j])                 
          if(array[j].type == type){
            // console.log('foundfriendlyBattle', array[j]);
            battles.push(array[j])
            
            
          }
        }
        resolve(battles)
        
        
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

    updateClan(clan:any){
      var reparedUserId = '%23'+ clan.Name.slice(1, clan.Name.length)
      return this.query.post('clashRoyalclans/'+reparedUserId, clan)
    }
          
          
      
  
    getAllBattlesFromDataBase(){
      return this.query.get('friendlybattles/')
    }

    
  
      
}