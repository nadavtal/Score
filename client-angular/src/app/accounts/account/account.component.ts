import { Component, OnInit, Input } from '@angular/core';
import { Account } from '../account.model';
import { ClashRoyaleService } from '../accounts-services/clash-royale.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ProgressService } from 'src/app/shared/components/progress-loader/progressLoader.service';

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
  clan:any;
  loaded:boolean = false;

  constructor(private clashRoyaleService: ClashRoyaleService,
              private progressService: ProgressService,
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
        console.log(this.accountType)
        
        if (this.platform == 'Clash Royale'){
          if(this.accountType == 'user'){
            
            // this.progressService.progressMsg.next('getting clash user')
            console.log(this.accountType)
            this.clashRoyaleService.getClashUser(this.accountId)
            .subscribe((account:any) => {
              this.account = account;
              console.log('account in accounComponent', this.account);
              this.clashRoyaleService.clashUser.next(this.account)
            });
          } 
          else if (this.accountType == 'clan'){
            // this.progressService.progressMsg.next('getting clash clan')
            console.log(this.accountType)
            this.clashRoyaleService.getClashRoyalClan(this.accountId)
            .subscribe((clan:any) => {
              this.account = clan.data.clanFromClashApi
              this.clan = clan.data.clanFromDb
              console.log('clan in accounComponent', this.clan);
              this.clashRoyaleService.clashClan.next(this.account)
              
            })
          }
        }
        // switch(this.platform) { 
        //   case 'Clash Royale': { 
        //     switch(this.accountType){
        //       case "user": {
        //         console.log(this.accountType)
        //         this.clashRoyaleService.getClashUser(this.accountId)
        //         .subscribe((account:any) => {
        //           this.account = account;
        //           console.log('account in accounComponent', this.account);
        //           this.clashRoyaleService.clashUser.next(this.account)
                  
        //         })
        //       }
        //       case "clan": {
        //         console.log(this.accountType)
        //         this.clashRoyaleService.getClashRoyalClan(this.accountId)
        //         .subscribe((clan:any) => {
        //           this.account = clan.data.clanFromClashApi
        //           this.clan = clan.data.clanFromDb
        //           console.log('clan in accounComponent', this.clan);
        //           this.clashRoyaleService.clashClan.next(this.account)
                  
        //         })
               
        //       }
        //     }
            
        //      break; 
        //   } 
          
        // }
        
      }
    );
    
  }

  changeActiveTab(event){
    console.log(event);
    this.tab = event;
    
  }

}
