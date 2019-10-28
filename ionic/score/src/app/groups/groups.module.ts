import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupsComponent } from './groups.component';
import { GroupItemComponent } from './group-item/group-item.component';



import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
    // {
    //   path: '',
    //   component: GroupsComponent
    // }
  ];

@NgModule({
    declarations: [
        GroupsComponent,

        GroupItemComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
        ],
    exports: [
        GroupsComponent,

        GroupItemComponent,

    ],
})
export class GroupsModule {

}
