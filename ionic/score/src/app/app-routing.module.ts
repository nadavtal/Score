import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TournamentComponent } from './games/tournament/tournament.component';
import { GamesComponent } from './games/games.component';
import { GameComponent } from './games/game/game.component';
import { AccountComponent } from './accounts/account/account.component';
import { TournamentListComponent } from './games/tournament-list/tournament-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: 'home', loadChildren: () => import('./homepage/homepage.module').then( m => m.HomepagePageModule)},
  { path: 'users',
    children: [
      {
        path: '',
        loadChildren: './users/users.module#UsersPageModule'
      },
      {
        path: ':userId', loadChildren: './users/user/user.module#UserPageModule'
      }
    ]
  },
  { path: 'groups',
    children: [
      {
        path: '',
        loadChildren: './groups/groups.module#GroupsModule'
      },
      {
        path: ':groupId', loadChildren: './groups/group/group.module#GroupModule'
      }
    ]
  },
  {path: 'tournaments',
    children: [
      {
        path: '',
        component: TournamentListComponent
      },
      {
        path: ':tournamentId', loadChildren: './games/tournament/tournament.module#TournamentModule'
      }

    ],
  },
  { path: 'games', component: GamesComponent},
  { path: 'games/:gameId', component: GameComponent},
  {path: 'accounts/:platform/:accountType/:accountId', component: AccountComponent},
  { path: 'home', loadChildren: './homepage/homepage.module#HomepagePageModule' },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
