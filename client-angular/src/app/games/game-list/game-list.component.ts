import { Component, OnInit, OnDestroy } from '@angular/core';
import { Game } from '../game.model';
import { GamesService } from '../games.service';
import { UsersService } from 'src/app/users/users.service';
import { User } from 'src/app/users/user.model';
import { ActivatedRoute, Params } from '@angular/router';
import { GroupsService } from 'src/app/groups/groups.service';
import { Utils } from 'src/app/shared/services/utils.service';
import { SubSink } from 'node_modules/subsink/dist/subsink'
import { listAnimation, moveInUp } from '../../shared/animations'
import { localStorageService } from 'src/app/shared/services/local-storage.service';
import { MessagesService } from 'src/app/messages/messages.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  animations:[
    listAnimation,
    moveInUp
 
  ]
})
export class GameListComponent implements OnInit, OnDestroy {
  user:User;
  group: any;
  games: Game[];
  id:string;
  actions: any;
  currentUser:any;
  loaded: boolean = false;
  topPositionHeaderClass: string;
  topPositionContentClass: string;
  showFilterSection:boolean = false;
  showSwitchButton:boolean = true;
  isLoggedIn:boolean;
  
  private subs = new SubSink();
  private message:any = {};
  constructor(private gamesService: GamesService,
              private usersService: UsersService,
              private groupService: GroupsService,
              private messagesService: MessagesService,
              private loaclStorage: localStorageService,
              private utilsService: Utils,
              private route: ActivatedRoute) { }

  ngOnInit() {
    if(this.loaclStorage.get('currentUser')){
      this.currentUser = this.loaclStorage.get('currentUser');

    }
    if(this.currentUser){
      this.isLoggedIn = true
    }
    
    this.actions= [
      {name: 'Filter', color: 'green', icon: 'filter', },
       ];
    
    this.subs.sink = this.route.parent.params
        .subscribe(
          (params: Params) => {
            console.log(params);
            if(params['userId']){
              this.id = params['userId'];
              this.topPositionHeaderClass = 'pageHeaderTabs'
              this.topPositionContentClass = 'pageContentTabs'
              this.subs.sink = this.usersService.getUserFromDb(this.id)
                .subscribe((user:any) => {
                  // console.log(user.data)
                  this.user = user.data
                  // console.log('user in GameListComponent from server', this.user);
                  this.subs.sink = this.gamesService.getGamesByUserID(this.user._id)
                  .subscribe((games:any) => {
                    this.games = games.data
                    this.addRegisteredToGames(this.user, this.games)
                    console.log(this.games);
                    this.loaded = true;
                  });
                });
            } 
            else if(params['groupId']){
              this.id = params['groupId'];
              
              this.topPositionHeaderClass = 'pageHeaderTabs'
              this.topPositionContentClass = 'pageContentTabs'
              this.subs.sink = this.groupService.getGroupFromDb(this.id)
                .subscribe((group:any) => {
                  // this.userLoaded = true;
                  this.group = group.data
                  console.log('group in GameListComponent from server', this.group);
                  this.subs.sink = this.gamesService.getGamesByGroupId(this.id)
                  .subscribe((games:any) => {
                    this.games = games.data
                    console.log(this.games);
                    this.loaded = true;
                  });

                })
              
            } else{
              this.topPositionHeaderClass = 'pageHeader';
              this.topPositionContentClass = 'pageContent';
              this.showSwitchButton = false;
              this.subs.sink = this.gamesService.getGames()
                  .subscribe((games:any) => {
                    this.games = games.data;
                    console.log(this.games);
                    this.loaded = true;
                  })
            }
            
            
          }
        );
    
    
  }

  
  sweetAlertConfirm(data:any){
    console.log(data);
    this.createNewGame(data.values)
  }

  createNewGame(game:any){
    this.gamesService.gameCreation(game, this.currentUser, this.group)
      .then((newGame:any)=>{
        console.log(newGame)
        this.games.push(newGame);
      })
          
  }

  addRegisteredToGames(user, games){
    for(let i=0; i<games.length;i++){
      games[i].registered = this.utilsService.checkIfUserInArrayByUsername(games[i].players, user.userName) 
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
