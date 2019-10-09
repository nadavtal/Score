import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { InfoComponent } from './info/info.component';
import { GroupsModule } from 'src/app/groups/groups.module';
import { AccountsModule } from 'src/app/accounts/accounts.module';
import { GamesModule } from 'src/app/games/games.module';
import { MessagesModule } from 'src/app/messages/messages.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { RouterModule } from '@angular/router';
import { UserRoutingModule } from './user-routing.module';
import { FriendsComponent } from 'src/app/friends/friends.component';

@NgModule({
    declarations:[
        UserComponent,
        InfoComponent,
        FriendsComponent
    ],
    imports: [
        GroupsModule,
        AccountsModule,
        GamesModule,
        MessagesModule,
        UserRoutingModule,
        SharedModule,
        RouterModule,

    ],
    exports:[
        // UserComponent,
        // InfoComponent
    ]
})
export class UserModule{}