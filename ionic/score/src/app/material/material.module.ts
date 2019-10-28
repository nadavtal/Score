import { NgModule } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import {MatTooltipModule} from '@angular/material/tooltip';

const materialComponents = [
  MatIconModule,
  MatInputModule,
  MatGridListModule,
  MatSelectModule,
  MatTabsModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTooltipModule
];

@NgModule({
  imports: [
    materialComponents,
  ],
  exports: [
    materialComponents,
  ]
})
export class MaterialModule { }
