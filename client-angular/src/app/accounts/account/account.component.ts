import { Component, OnInit, Input } from '@angular/core';
import { Account } from '../account.model';
import { ClashRoyaleService } from '../accounts-services/clash-royale.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  tab:any;
  account:any;
  accountId:any;
  
  constructor(private clashService: ClashRoyaleService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.tab = 'Info';
    this.route.params
    .subscribe(
      (params: Params) => {
        // this.path = this.route.snapshot.url[0].path;
        // this.tab = this.route.snapshot.url[2].path;
        console.log(this.clashService)
        this.accountId = params['accountId'];
        this.clashService.getClashUser(this.accountId)
          .subscribe((account:any) => {
            this.account = account;
            console.log('account in accounComponent', this.account);
            this.clashService.clashUser.next(this.account)
            
          })
      }
    );
    
  }

  changeActiveTab(event){
    console.log(event);
    this.tab = event;
    
  }

}
