import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { GroupComponent } from './group.component';
import { GroupInfoComponent } from './group-info/group-info.component';

import { GroupRoutingModule } from './groupRoutingModule';
import { SharedModule } from '../../shared/shared.module';
import { GamesModule } from 'src/app/games/games.module';
import { MessagesModule } from 'src/app/messages/messages.module';
import { IonicModule } from '@ionic/angular';


@NgModule({
    declarations: [

        GroupComponent,
        GroupInfoComponent,

    ],
    imports: [
        SharedModule,
        GamesModule,
        MessagesModule,
        IonicModule,
        RouterModule,
        GroupRoutingModule
    ],
    exports: [

        // GroupsComponent,  //no need to export component that you user in the routing module
        // GroupItemComponent,

    ],
})
export class GroupModule {

}
