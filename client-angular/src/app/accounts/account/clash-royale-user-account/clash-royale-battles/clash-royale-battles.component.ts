import { Component, OnInit } from '@angular/core';
import { ClashRoyaleService } from '../../../accounts-services/clash-royale.service';
import { BattlesService } from 'src/app/shared/services/battles.service';

import { ProgressService } from 'src/app/shared/components/progress-loader/progressLoader.service';
import { InfinitScrollService } from 'src/app/shared/components/infinite-scroll/infinite-scroll.service';

@Component({
  selector: 'app-clash-royale-battles',
  templateUrl: './clash-royale-battles.component.html',
  styleUrls: ['./clash-royale-battles.component.scss']
})
export class ClashRoyaleBattles implements OnInit {
  loaded:boolean = false;
  battles:any;
  pageOfItems: Array<any>
  constructor(private clashRoyaleService:ClashRoyaleService,
              private progressService: ProgressService,
              private inifiniteScrollService: InfinitScrollService,
              private battlesService: BattlesService) { }

  ngOnInit() {
    // this.progressService.loading.next(true)
    
    this.clashRoyaleService.clashUser
      .subscribe((clashUser:any) => {
        this.progressService.progressMsg.next('Updating Battles')
        
        console.log(clashUser);
        if(clashUser.updatedUser){
          this.battles = clashUser.updatedUser.battles;
          // console.log('GOTBATTLES', this.battles);
          this.inifiniteScrollService.infiniteScrollData.next(this.battles)
          this.progressService.loading.next(false)
          this.loaded = true
        } else{
          console.log(clashUser.clashUser.tag)
          this.clashRoyaleService.getClashUserBattles(clashUser.clashUser.tag)
            .subscribe((battles:any)=> {
              this.battles = battles;
              this.inifiniteScrollService.infiniteScrollData.next(this.battles)
              this.progressService.loading.next(false)
              this.loaded = true
            })
        }
        
      })
    this.clashRoyaleService.clashClan
      .subscribe((clan:any) => {
        this.progressService.progressMsg.next('Getting Battles From Clash Royale')
        this.clashRoyaleService.getBattlesByTypeAndClanFromClashApi(clan.tag, 'clanMate')
          .then((foundBattles:any) => {
            this.progressService.progressMsg.next('Checking if battles exist')
            console.log('found clanMate Battles in Clash Royale', foundBattles);
            this.checkIfBattlesExistsAndSave(foundBattles)
              .then((data)=>{
                
                console.log(data);
                this.progressService.progressMsg.next('Getting battles from data base')
                this.battlesService.getBattlesByClanTag(clan.tag)
                  .subscribe((battles:any) => {
                    this.progressService.progressMsg.next('Battles updated')
                    
                    this.battles = battles.data;
                    console.log(this.battles);
                    this.inifiniteScrollService.infiniteScrollData.next(this.battles)
                    this.progressService.loading.next(false)
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

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  onScroll() {
    console.log('scrolled!!');
  }

}
