import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GroupsComponent } from './groups.component';
import { GroupItemComponent } from './group-item/group-item.component';
import { GroupComponent } from '../groups/group/group.component';

import { GroupsRoutingModule } from './GroupsRoutingModule';
import { SharedModule } from '../shared/shared.module';


@NgModule({
    declarations: [
        GroupsComponent,
        GroupItemComponent,
        GroupComponent
    ],
    imports: [
        SharedModule,
        RouterModule,
        GroupsRoutingModule
    ],
    exports: [
        
        // GroupsComponent,  //no need to export component that you user in the routing module
        // GroupItemComponent, 
        
    ],
})
export class GroupsModule {

}