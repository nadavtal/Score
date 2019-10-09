import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { InfoComponent } from './info/info.component';
import { AccountsComponent } from 'src/app/accounts/accounts.component';
import { GroupsComponent } from 'src/app/groups/groups.component';
import { FriendsComponent } from 'src/app/friends/friends.component';
import { GamesComponent } from 'src/app/games/games.component';
import { MessagesComponent } from 'src/app/messages/messages.component';



const routes: Routes = [
    {path: '', component: UserComponent, children:[
        {path: 'Profile', component: InfoComponent},
        {path: 'Accounts', component: AccountsComponent},
        {path: 'Groups', component: GroupsComponent},
        {path: 'Friends', component: FriendsComponent},
        {path: 'Games', component: GamesComponent},
        {path: 'Messages', component: MessagesComponent},
    ]},
    
]

@NgModule({
    imports: [

        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class UserRoutingModule {

}