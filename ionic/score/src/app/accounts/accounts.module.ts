import { NgModule } from '@angular/core';
import { AccountsComponent } from './accounts.component';
import { AccountItemComponent } from './account-item/account-item.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';


@NgModule({
    declarations:[
        AccountsComponent,
        AccountItemComponent
    ],
    imports: [
        SharedModule,
        RouterModule,
     
    ],
    exports:[
        AccountsComponent,
        AccountItemComponent
    ]
})
export class AccountsModule{

}