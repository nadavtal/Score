import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomepageComponent } from './homepage.page';
import { AuthComponent } from '../auth/auth.component';
import { SharedModule } from '../shared/shared.module';
import { GameListComponent } from '../games/game-list/game-list.component';
import { GroupsComponent } from '../groups/groups.component';
import { TournamentListComponent } from '../games/tournament-list/tournament-list.component';
import { GamesModule } from '../games/games.module';
import { GroupsModule } from '../groups/groups.module';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    children: [
      {path: 'Tournaments', component: TournamentListComponent},
      {path: 'Games', component: GameListComponent},
      {path: 'Leages', component: GameListComponent},
      {path: 'Groups', component: GroupsComponent},
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    GamesModule,
    GroupsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    HomepageComponent,
    AuthComponent
  ]
})
export class HomepagePageModule {}
