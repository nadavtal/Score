import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users/users.component';
import { GamesComponent } from './games/games.component';

import { UserComponent } from './users/user/user.component';
import { GroupComponent } from './groups/group/group.component';
import { GroupsComponent } from './groups/groups.component';
import { AccountsComponent } from './accounts/accounts.component';
import { FriendsComponent } from './friends/friends.component';
import { MessagesComponent } from './messages/messages.component'
import { InfoComponent } from './users/user/info/info.component';
// import { GroupInfoComponent } from './groups/group/group-info/group-info.component';
// import { StatsComponent } from './shared/components/stats/stats.component';
import { TournamentComponent } from './games/tournament/tournament.component';
// import { TournamentInfoComponent } from './games/tournament/tournament-info/tournament-info.component';
// import { TournamentStructureComponent } from './games/tournament/tournament-structure/tournament-structure.component';
// import { TournamentPrizesComponent } from './games/tournament/tournament-prizes/tournament-prizes.component';
import { HomepageComponent } from './homepage/homepage.component';
import { GameComponent } from './games/game/game.component';
import { AccountComponent } from './accounts/account/account.component';
import { TournamentListComponent } from './games/tournament-list/tournament-list.component';
import { GameListComponent } from './games/game-list/game-list.component';


const appRoutes: Routes = [
    // {path: 'users/:id', component: UserComponent, children:[
    //     {path: 'Profile', component: InfoComponent},
    //     {path: 'Accounts', component: AccountsComponent},
    //     {path: 'Groups', component: GroupsComponent},
    //     {path: 'Friends', component: FriendsComponent},
    //     {path: 'Games', component: GamesComponent},
    //     {path: 'Messages', component: MessagesComponent},
    // ]},
    // {path: 'users/:userId/:tabName', component: UserComponent},
    
    {path: 'users/:userId', component: UserComponent, children:[
        {path: 'Profile', component: InfoComponent},
        {path: 'Accounts', component: AccountsComponent},
        {path: 'Groups', component: GroupsComponent},
        {path: 'Friends', component: FriendsComponent},
        {path: 'Games', component: GamesComponent},
        {path: 'Messages', component: MessagesComponent},
    ]},
    {path: 'users', component: UsersComponent},
    // {path: 'groups/:groupId', component: GroupComponent, children:[
    //     {path: 'Info', component: GroupInfoComponent},
    //     {path: 'Stats', component: StatsComponent},
    //     {path: 'Games', component: GamesComponent},
    //     {path: 'Messages', component: MessagesComponent},
    // ]},
    // {path: 'groups', component: GroupsComponent, children:[
        
    // ]},
    {path: 'tournaments/:tournamentId', component: TournamentComponent},
    {path: 'Tournaments', component: TournamentListComponent},
    { path: 'games', component: GamesComponent},
    { path: 'games/:gameId', component: GameComponent},
    {path: 'accounts/:platform/:accountId', component: AccountComponent},
    {path: 'home', component:HomepageComponent, children:[
        {path: 'Tournaments', component: TournamentListComponent},
        {path: 'Games', component: GameListComponent},
        {path: 'Leages', component: GameListComponent},
        {path: 'Groups', component: GroupsComponent},
    ]},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
]


@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class appRoutingModule {

}