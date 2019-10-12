import { NgModule } from '@angular/core';
import { AccountComponent } from './account.component';
import { ClashUserInfoComponent } from './clash-royale-user-account/clash-user-info/clash-user-info.component';
import { ClashRoyaleBattles } from './clash-royale-user-account/clash-royale-battles/clash-royale-battles.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { ClashRoyaleBattleComponent } from './clash-royale-user-account/clash-royale-battles/clash-royale-battle/clash-royale-battle.component';

@NgModule({
    declarations:[
        AccountComponent,
        ClashUserInfoComponent,
        ClashRoyaleBattles, 
        ClashRoyaleBattleComponent
    ],
    imports: [
        SharedModule,
        RouterModule,
    ],
    exports:[
        AccountComponent,
        ClashUserInfoComponent,
        ClashRoyaleBattles, 
        ClashRoyaleBattleComponent,
    ]
})
export class AccountModule{

}