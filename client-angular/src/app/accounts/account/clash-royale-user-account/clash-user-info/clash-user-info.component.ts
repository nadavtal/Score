import { Component, OnInit, Input } from '@angular/core';
import { ClashRoyaleService } from '../../../accounts-services/clash-royale.service';

@Component({
  selector: 'app-clash-user-info',
  templateUrl: './clash-user-info.component.html',
  styleUrls: ['./clash-user-info.component.scss']
})
export class ClashUserInfoComponent implements OnInit {
  user:any;
  clan:any
  loaded:boolean = false;
  constructor(private clashRoyaleService:ClashRoyaleService) { }

  ngOnInit() {
    this.clashRoyaleService.clashUser
      .subscribe((clashUser:any) => {
        this.user = clashUser.clashUser
        // console.log(this.user);
        this.loaded = true
      })
    this.clashRoyaleService.clashClan
    .subscribe((clashClan:any) => {
      this.clan = clashClan
      // console.log(this.clan);
      this.loaded = true
      })
  }

}
