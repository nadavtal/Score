import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupComponent } from './group/group.component';
import { GroupInfoComponent } from './group/group-info/group-info.component';
import { StatsComponent } from '../shared/components/stats/stats.component';
import { GamesComponent } from '../games/games.component';
import { MessagesComponent } from '../messages/messages.component';
import { GroupsComponent } from './groups.component';

const routes: Routes = [
    {path: 'groups/:groupId', component: GroupComponent, children:[
        {path: 'Info', component: GroupInfoComponent},
        {path: 'Stats', component: StatsComponent},
        {path: 'Games', component: GamesComponent},
        {path: 'Messages', component: MessagesComponent},
    ]},
    {path: 'groups', component: GroupsComponent, children:[
        
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
export class GroupsRoutingModule {

}