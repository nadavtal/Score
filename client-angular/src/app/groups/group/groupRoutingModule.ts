import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupComponent } from './group.component';
import { GroupInfoComponent } from './group-info/group-info.component';
import { StatsComponent } from '../../shared/components/stats/stats.component';
import { GamesComponent } from '../../games/games.component';
import { MessagesComponent } from '../../messages/messages.component';


const routes: Routes = [
    {path: '', component: GroupComponent, children:[
        {path: 'Info', component: GroupInfoComponent},
        {path: 'Stats', component: StatsComponent},
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
export class GroupRoutingModule {

}