import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GroupsComponent } from './groups.component';
import { GroupItemComponent } from './group-item/group-item.component';



import { SharedModule } from '../shared/shared.module';


@NgModule({
    declarations: [
        GroupsComponent,
        
        GroupItemComponent,
    ],
    imports: [
        SharedModule,
       
        RouterModule,
     
    ],
    exports: [
        GroupsComponent,
        
        GroupItemComponent,
        
    ],
})
export class GroupsModule {

}