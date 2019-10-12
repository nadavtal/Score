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
  accountType:any;
  platform:any;
  constructor(private clashRoyaleService: ClashRoyaleService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.tab = 'Info';
    this.route.params
    .subscribe(
      (params: Params) => {
        console.log(params)
        this.accountType = params['accountType'];
        this.accountId = params['accountId'];
        this.platform = params['platform'];
        
        switch(this.platform) { 
          case 'Clash Royale': { 
            switch(this.accountType){
              case('user'): {
                this.clashRoyaleService.getClashUser(this.accountId)
                .subscribe((account:any) => {
                  this.account = account;
                  console.log('account in accounComponent', this.account);
                  this.clashRoyaleService.clashUser.next(this.account)
                  
                })
              }
              case('clan'): {
                this.clashRoyaleService.getClan(this.accountId)
                .subscribe((account:any) => {
                  this.account = account;
                  console.log('account in accounComponent', this.account);
                  this.clashRoyaleService.clashClan.next(this.account)
                  
                })
              }
            }
            
             break; 
          } 
          
       }
        
      }
    );
    
  }

  changeActiveTab(event){
    console.log(event);
    this.tab = event;
    
  }

}
