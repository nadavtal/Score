import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomepagePageModule } from './homepage/homepage.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GamesModule } from './games/games.module';
import { GroupsModule } from './groups/groups.module';
import { GroupModule } from './groups/group/group.module';
import { TournamentModule } from './games/tournament/tournament.module';
import { GameModule } from './games/game/game.module';
import { AccountsModule } from './accounts/accounts.module';
import { AccountModule } from './accounts/account/account.module';
import { MessagesModule } from './messages/messages.module';
import { AuthInterceptorService } from './auth-interceptor.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HomepagePageModule,
    SharedModule,
    GamesModule,
    GroupsModule,
    GroupModule,
    TournamentModule,
    GameModule,
    AccountsModule,
    AccountModule,
    MessagesModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
