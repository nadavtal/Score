import { Component, OnInit } from '@angular/core';
import { ClashRoyaleService } from '../../../accounts-services/clash-royale.service';
import { BattlesService } from 'src/app/shared/services/battles.service';
import { resolve, reject } from 'q';

@Component({
  selector: 'app-clash-royale-battles',
  templateUrl: './clash-royale-battles.component.html',
  styleUrls: ['./clash-royale-battles.component.scss']
})
export class ClashRoyaleBattles implements OnInit {
  loaded:boolean = false;
  battles:any
  constructor(private clashRoyaleService:ClashRoyaleService,
              private battlesService: BattlesService) { }

  ngOnInit() {
    this.clashRoyaleService.clashUser
      .subscribe((clashUser:any) => {
        console.log(clashUser);
        if(clashUser.updatedUser){
          this.battles = clashUser.updatedUser.battles

        } else{
          console.log(clashUser.clashUser.tag)
          this.clashRoyaleService.getClashUserBattles(clashUser.clashUser.tag)
            .subscribe((battles:any)=> {
              this.battles = battles
            })
        }
        this.loaded = true
      })
    this.clashRoyaleService.clashClan
      .subscribe((clan:any) => {
        this.battlesService.getBattlesByClanTag(clan.tag)
            .subscribe((battles:any) => {
              this.battles = battles.data;
              
              // this.battles = battles.data.concat(foundBattles)
              console.log(this.battles);
              this.clashRoyaleService.getBattlesByTypeAndClanFromClashApi(clan.tag, 'clanMate')
                .then((foundBattles:any) => {
                  console.log('foundBattles', foundBattles);
                  this.checkIfBattlesExistsAndSave(foundBattles)
                    .then((data)=>{
                      console.log(data);
                      this.loaded = true
                    })
                  
                })
            })
        
        
      })
  }

  checkIfBattlesExistsAndSave(battles){
    const self = this
    const promiseArray = [];
    for(var i=0; i<battles.length; i++){
      const promise = new Promise(function(resolve, reject){
        if(!battles[i]){
          reject('no battle here')
        }
        self.battlesService.checkIfBattleExists(battles[i])
        .then((battle:Boolean) =>{
          console.log('battle exists: ', battle)
      
          if(battle){
            self.battlesService.addBattleToDB('Clash Royale', battle)
              .subscribe((savedBattle:any)=>{
                self.battles.push(savedBattle.data);
                resolve(savedBattle.data)
              })
              
          }else{
            resolve('Battle in DB')
          }
        })
      })
      promiseArray.push(promise) 
     
      
    }
    return Promise.all(promiseArray)
    
  }

  getAndSaveNewBattles(){
    const promiseArray = [];

  }

}
