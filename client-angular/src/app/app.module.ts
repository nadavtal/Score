import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { appRoutingModule } from './app-routing.module';
import { UserListItemComponent } from './users/users-list/user-list-item/user-list-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DinamicModalComponent, DialogOverviewExampleDialog } from './shared/components/dinamic-modal/dinamic-modal.component';
import { AuthInterceptorService } from './auth-interceptor.service';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthComponent } from './auth/auth.component';
import { GroupFormComponent } from './groups/group/group-form/group-form.component';
import { CalculatePrizePoolComponent } from './shared/components/calculate-prize-pool/calculate-prize-pool.component';
import { GroupsModule } from './groups/groups.module';
import { SharedModule } from './shared/shared.module';
import { TournamentModule } from './games/tournament/tournament.module';
import { GameModule } from './games/game/game.module';
import { AccountsModule } from './accounts/accounts.module';
import { AccountModule } from './accounts/account/account.module';
import { MessagesModule } from './messages/messages.module';
import { GroupModule } from './groups/group/group.module';
import { GamesModule } from './games/games.module';
import { UserModule } from './users/user/user.module';



@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UsersListComponent,
    UserListItemComponent,
    DinamicModalComponent,
    DinamicModalComponent, 
    DialogOverviewExampleDialog, 
    HomepageComponent, 
    AuthComponent, 
    GroupFormComponent, 
    CalculatePrizePoolComponent, 
  ],
  imports: [
    BrowserModule,
    GroupsModule,
    GroupModule,
    TournamentModule,
    GameModule,
    appRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AccountsModule,
    AccountModule,
    MessagesModule,
    GamesModule,
    UserModule
    
  ],
  entryComponents: [DinamicModalComponent, DialogOverviewExampleDialog, GroupFormComponent],
  providers: [
    
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptorService, 
      multi: true
    },
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
