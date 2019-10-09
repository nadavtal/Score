import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SwitchCheckBoxComponent } from '../shared/components/switch-check-box/switch-check-box.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertComponent } from '../shared/components/sweet-alert/sweet-alert.component';
import { IconActionsComponent } from '../shared/components/icon-actions/icon-actions.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule } from '@angular/forms';
import { IconToRowComponent } from '../shared/components/icon-to-row/icon-to-row.component';
import { dinamicTabsComponent } from '../dinamic-tabs/dinamic-tabs.component';
import { ToolBarComponent } from '../shared/components/tool-bar/tool-bar.component';

@NgModule({
    declarations: [
        SwitchCheckBoxComponent,
        SweetAlertComponent,
        IconActionsComponent,
        dinamicTabsComponent,
        IconToRowComponent,
        ToolBarComponent
    ],
    imports: [
        RouterModule,
        SweetAlert2Module.forRoot(),
        CommonModule,
        MaterialModule,
        AngularFontAwesomeModule,
        FormsModule,
    ],
    exports: [
        SwitchCheckBoxComponent,
        SweetAlertComponent,
        IconActionsComponent,
        dinamicTabsComponent,
        IconToRowComponent,
        ToolBarComponent,
        CommonModule,
        MaterialModule,
        AngularFontAwesomeModule,
        FormsModule,
        SweetAlert2Module
    ]
})
export class  SharedModule{

}