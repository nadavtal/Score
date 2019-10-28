import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserPage } from './user.page';
import { AccountsModule } from 'src/app/accounts/accounts.module';
import { GroupsModule } from 'src/app/groups/groups.module';
import { GamesModule } from 'src/app/games/games.module';
import { MessagesModule } from 'src/app/messages/messages.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { InfoComponent } from './info/info.component';
import { AccountsComponent } from 'src/app/accounts/accounts.component';
import { GroupsComponent } from 'src/app/groups/groups.component';
import { FriendsComponent } from 'src/app/friends/friends.component';
import { GamesComponent } from 'src/app/games/games.component';
import { MessagesComponent } from 'src/app/messages/messages.component';

const routes: Routes = [
  {
    path: '',
    component: UserPage,
    children: [
      {path: 'Profile', component: InfoComponent},
      {path: 'Accounts', component: AccountsComponent},
      {path: 'Groups', component: GroupsComponent},
      {path: 'Friends', component: FriendsComponent},
      {path: 'Games', component: GamesComponent},
      {path: 'Messages', component: MessagesComponent},
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupsModule,
    AccountsModule,
    GamesModule,
    MessagesModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    UserPage,
    InfoComponent,
    FriendsComponent
  ]
})
export class UserPageModule {}
