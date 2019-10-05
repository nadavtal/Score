import { Component, OnInit } from '@angular/core';
import { ClashRoyaleService } from '../../accounts-services/clash-royale.service';

@Component({
  selector: 'app-account-battles',
  templateUrl: './account-battles.component.html',
  styleUrls: ['./account-battles.component.scss']
})
export class AccountBattlesComponent implements OnInit {
  loaded:boolean;
  battles:any
  constructor(private clashRoyaleService:ClashRoyaleService) { }

  ngOnInit() {
    this.clashRoyaleService.clashUser
      .subscribe((clashUser:any) => {
        this.battles = clashUser.updatedUser.battles
        console.log(this.battles);
        this.loaded = true
      })
  }

}
