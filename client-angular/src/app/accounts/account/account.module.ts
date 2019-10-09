import { NgModule } from '@angular/core';
import { AccountComponent } from './account.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountBattlesComponent } from './account-battles/account-battles.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { ClashRoyaleBattleComponent } from './account-battles/clash-royale-battle/clash-royale-battle.component';

@NgModule({
    declarations:[
        AccountComponent,
        AccountInfoComponent,
        AccountBattlesComponent, 
        ClashRoyaleBattleComponent
    ],
    imports: [
        SharedModule,
        RouterModule,
    ],
    exports:[
        AccountComponent,
        AccountInfoComponent,
        AccountBattlesComponent, 
        ClashRoyaleBattleComponent,
    ]
})
export class AccountModule{

}