import { Component, OnInit } from '@angular/core';
import { Game } from '../game.model';
import { GamesService } from '../games.service';
import { UsersService } from 'src/app/users/users.service';
import { User } from 'src/app/users/user.model';
import { ActivatedRoute, Params } from '@angular/router';
import { GroupsService } from 'src/app/groups/groups.service';
import { Utils } from 'src/app/shared/services/utils.service';
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { listAnimation, moveInUp } from '../../shared/animations'

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  animations:[
    listAnimation,
    moveInUp
 
  ]
})
export class GameListComponent implements OnInit {
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
  constructor(private gamesService: GamesService,
              private usersService: UsersService,
              private groupService: GroupsService,
              private utilsService: Utils,
              private route: ActivatedRoute) { }

  ngOnInit() {
    
    
    this.actions= [
      {name: 'Filter', color: 'green', icon: 'filter', },
       ];
    // this.usersService.userSelected
    // .subscribe((user:any)=>{
    //   this.user = user;
    //   // console.log('user in AccountsComponent sub', this.user);
     
    //   this.gamesService.getGamesByUserID(this.user._id)
    //       .subscribe((games:any) => {
    //         this.games = games.data
    //         this.addRegisteredToGames(this.user, this.games);
    //         
    //         // console.log(this.games);
    //         this.loaded = true;
    //       });
  
    // })
    this.route.parent.params
        .subscribe(
          (params: Params) => {
            console.log(params);
            if(params['userId']){
              this.id = params['userId'];
              this.topPositionHeaderClass = 'pageHeaderTabs'
              this.topPositionContentClass = 'pageContentTabs'
              this.usersService.getUserFromDb(this.id)
                .subscribe((user:any) => {
                  // console.log(user.data)
                  this.user = user.data
                  // console.log('user in GameListComponent from server', this.user);
                  this.gamesService.getGamesByUserID(this.user._id)
                  .subscribe((games:any) => {
                    this.games = games.data
                    this.addRegisteredToGames(this.user, this.games)
                    console.log(this.games);
                    this.loaded = true;
                  });
                });
            } else if(params['groupId']){
              this.id = params['groupId'];
              this.topPositionHeaderClass = 'pageHeaderTabs'
              this.topPositionContentClass = 'pageContentTabs'
              this.groupService.getGroupFromDb(this.id)
                .subscribe((group:any) => {
                  // this.userLoaded = true;
                  this.group = group.data
                  console.log('group in GameListComponent from server', this.group);
                  this.gamesService.getGamesByGroupId(this.id)
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
              this.gamesService.getGames()
                  .subscribe((games:any) => {
                    this.games = games.data;
                    console.log(this.games);
                    this.loaded = true;
                  })
            }
            
            
          }
        );
    
    
  }

  getUser(){
    return new Promise<User>((resolve, reject) => { 
      
      if(this.usersService.getUser()){
        const user = this.usersService.getUser();
        // console.log('user in FriendsComponent from getUser', this.user);
        resolve(user)
        
      }else{
        this.route.parent.params
        .subscribe(
          (params: Params) => {
            console.log(params)
            this.id = params['id'];
            this.usersService.getUserFromDb(this.id)
              .subscribe((user:any) => {
                // console.log(user.data)
                this.user = user.data
                // console.log('user in FriendsComponent from server', this.user);
                resolve(this.user)
  
              })
          }
        );
      };

    })
  }

  sweetAlertConfirm(data:any){
    console.log(data);
    this.createNewGame(data.values)
  }

  createNewGame(game:any){
    game.host = this.user.userName;
    game.players = [{userName: this.user.userName,
                    userId: this.user._id}]
    this.gamesService.createGame(game)
      .subscribe((newGame:any) => {
        console.log('new game created', newGame.data);
        this.games.push(newGame.data)
      })
  }

  addRegisteredToGames(user, games){
    for(let i=0; i<games.length;i++){
      games[i].registered = this.utilsService.checkIfUserInArrayByUsername(games[i].players, user.userName) 
    }
  }

}
