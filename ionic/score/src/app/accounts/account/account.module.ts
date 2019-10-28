import { NgModule } from '@angular/core';
import { AccountComponent } from './account.component';
import { ClashUserInfoComponent } from './clash-royale-user-account/clash-user-info/clash-user-info.component';
import { ClashRoyaleBattles } from './clash-royale-user-account/clash-royale-battles/clash-royale-battles.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
    declarations:[
        AccountComponent,
        ClashUserInfoComponent,
        ClashRoyaleBattles, 
        
    ],
    imports: [
        SharedModule,
        RouterModule,
    ],
    exports:[
        AccountComponent,
        ClashUserInfoComponent,
        ClashRoyaleBattles, 
        
    ]
})
export class AccountModule{

}