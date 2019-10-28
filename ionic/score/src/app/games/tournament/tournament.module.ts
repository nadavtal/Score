import { NgModule } from '@angular/core';
import { TournamentComponent } from './tournament.component';
import { TournamentInfoComponent } from './tournament-info/tournament-info.component';
import { TournamentStructureComponent } from './tournament-structure/tournament-structure.component';
import { TournamentPrizesComponent } from './tournament-prizes/tournament-prizes.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
    {
      path: '',
      component: TournamentComponent,
      children: [
        {path: 'Info', component: TournamentInfoComponent},
        {path: 'Structure', component: TournamentStructureComponent},
        {path: 'Prizes', component: TournamentPrizesComponent},
       ]
    }
  ];
@NgModule({
    declarations: [
        TournamentComponent,
        TournamentInfoComponent,
        TournamentStructureComponent,
        TournamentPrizesComponent,
    ],
    imports: [
        SharedModule,
        IonicModule,
        RouterModule.forChild(routes)

    ],
    exports: [
        TournamentComponent,
        TournamentInfoComponent,
        TournamentStructureComponent,
        TournamentPrizesComponent,
    ]
})
export class  TournamentModule {}
