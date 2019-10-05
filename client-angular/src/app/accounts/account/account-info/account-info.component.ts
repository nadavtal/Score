import { Component, OnInit, Input } from '@angular/core';
import { ClashRoyaleService } from '../../accounts-services/clash-royale.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {
  user:any;
  loaded:boolean = false;
  constructor(private clashRoyaleService:ClashRoyaleService) { }

  ngOnInit() {
    this.clashRoyaleService.clashUser
      .subscribe((clashUser:any) => {
        this.user = clashUser.clashUser
        console.log(this.user);
        this.loaded = true
      })
  }

}
