import { Component, OnInit } from '@angular/core';
import { ClashRoyaleService } from '../../../accounts-services/clash-royale.service';
import { BattlesService } from 'src/app/shared/services/battles.service';

@Component({
  selector: 'app-clash-royale-battles',
  templateUrl: './clash-royale-battles.component.html',
  styleUrls: ['./clash-royale-battles.component.scss']
})
export class ClashRoyaleBattles implements OnInit {
  loaded:boolean;
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
          console.log(battles);
            this.battles = battles.data
          })
      })
  }

}
