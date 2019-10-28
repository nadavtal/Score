import { Injectable } from '@angular/core';
import { QueryService } from './query.service';

@Injectable({providedIn: 'root'})
export class BattlesService{

    constructor(private query:QueryService){}

    getAllBattles(){
        return this.query.get('battles')
    }

    getBattlesByClanTag(clanTag:string){
        // console.log(clanTag)
        var reparedclanTag = '%23'+ clanTag.slice(1, clanTag.length)
        return this.query.get('battles/'+ reparedclanTag)
    }

    getOneBattle(time, clanTag){
        // console.log(time, clanTag)
        var reparedclanTag = '%23'+ clanTag.slice(1, clanTag.length)
        let url = 'friendlybattles/'+time+'/'+ reparedclanTag;
        // console.log(url)
        return this.query.get(url)
    }

    checkIfBattleExists(battle){
        var promise = new Promise((resolve, reject)=> {
        if(!battle){
            reject('no battle in function')
        }
        this.getOneBattle(battle.battleTime, battle.team[0].clan.tag)
            .subscribe((returnedBattle:any)=> {
                console.log(returnedBattle)
                if(returnedBattle.length > 0){
                    // console.log('inDB')
                    resolve(false)
                } else{
                    resolve(battle)
                }
            })
        })
    
    return promise  
    }

    addBattleToDB(platform, battle){
        // var promise = new Promise((resolve, reject) => {
        // console.log(battle)
        var clanid = battle.team[0].clan.tag;
          var reparedUserId = '%23'+ clanid.slice(1, clanid.length)
          // console.log(clanid, reparedUserId)
          return this.query.post('battles/'+reparedUserId, battle)
    }
}