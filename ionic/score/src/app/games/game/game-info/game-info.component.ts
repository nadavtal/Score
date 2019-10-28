import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GamesService } from '../../games.service';
import { NgForm } from '@angular/forms';
import { localStorageService } from 'src/app/shared/services/local-storage.service';
import { Utils } from 'src/app/shared/services/utils.service';
import { listAnimation, moveInUp } from '../../../shared/animations'
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SubSink } from 'node_modules/subsink/dist/subsink'
import { PrivacyService } from 'src/app/shared/services/privacyService';
import { PlatformsService } from 'src/app/shared/services/platforms.service';
import { GroupsService } from 'src/app/groups/groups.service';
import { MessagesService } from 'src/app/messages/messages.service';
import { getTreeControlMissingError } from '@angular/cdk/tree';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss'],
  animations: [listAnimation, moveInUp]
})
export class GameInfoComponent implements OnInit, OnDestroy {
  @ViewChild('gameForm', {static: false}) private gameForm: NgForm;
  @ViewChild('gameSwal', {static: false}) private gameSwal: SwalComponent;
  id: string;
  game:any;
  loaded:boolean =  false;
  registered: boolean;
  editMode: boolean = false;
  actions:any;
  toolBarActions:any;
  currentUser:any;
  currentUserGroups:any;
  gameTypes: any;
  groupsNum: number;
  privacyOptions: any;
  platforms:any;

  private subs = new SubSink();
  
  
  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private utilsService: Utils,
      private platformService: PlatformsService,
      private groupsService: GroupsService,
      private localStorage: localStorageService,
      private messagesService: MessagesService,
      private privacyService: PrivacyService,
      private gamesService: GamesService) { }

  ngOnInit() {
    
    this.currentUser = this.localStorage.get('currentUser')
    this.subs.sink = this.groupsService.getGroupsManagedByUserID(this.currentUser._id)
      .subscribe((groups:any) => {
        this.currentUserGroups = groups.data
      })
    this.currentUserGroups
    this.actions= [
      {name: 'Edit', color: 'green', icon: 'envelope-open'},
      {name: 'Save', color: 'green', icon: 'user-plus'},
      
      
    ];
    this.subs.sink = this.platformService.getPlatforms()
      .subscribe((platforms:any)=>{
        this.platforms = platforms.data
      })
    this.privacyOptions = this.privacyService.privacyOptions

    this.toolBarActions= [
      {name: 'Log out', color: 'green', icon: 'home', },
      {name: 'Home', color: 'green', icon: 'home'},
      {name: 'My profile', color: 'orange', icon: 'user', function: this.goToMyProfile.bind(this)},
      {name: 'Store', color: 'black', icon: 'shopping-cart'},
      
      ];

    this.subs.sink = this.gamesService.getGameTypes()
      .subscribe((gameTypes:any) => {
        this.gameTypes = gameTypes.data;
        console.log(this.gameTypes)
      })
    this.subs.sink = this.route.params
        .subscribe(
          (params: Params) => {
            console.log(params)
            this.id = params['gameId'];
            this.subs.sink = this.gamesService.getGame(this.id)
              .subscribe((game:any) => {
                
                this.game = game.data
                console.log('game in GameInfoComponent from server', this.game);
                this.groupsNum = this.game.gameGroups.length
                this.registered = this.utilsService.checkIfUserInArrayByUsername(this.game.players, this.currentUser.userName);
                this.loaded = true;
                
              })
          }
        );

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  editGame(){
    this.editMode = !this.editMode;
    
  }
  saveGame(){
    console.log(this.game);
    if(this.editMode == true){
      this.editMode = !this.editMode;

    }
    this.subs.sink = this.gamesService.editGame(this.game)
      .subscribe((upadtedGame:any)=> {
        this.game = upadtedGame.data;
        this.registered = this.utilsService.checkIfUserInArrayByUsername(this.game.players, this.currentUser.userName);
        console.log(this.game);
      })
  }
 

  onSubmit(){
    console.log(this.gameForm)
  }

  joinGame(){
    console.log('joining game')
    this.game.players.push({
      userName: this.currentUser.userName,
      userId: this.currentUser._id
    });
    this.subs.sink = this.gamesService.editGame(this.game)
      .subscribe((upadtedGame:any)=> {
        this.game = upadtedGame.data;
        this.gameSwal.title="GOOD LUCK";
        this.gameSwal.text="You are registered to this game";
        this.gameSwal.type="success";
        this.gameSwal.timer = 1000;

        // console.log(this.gameSwal)
        this.gameSwal.fire()
        this.registered = this.utilsService.checkIfUserInArrayByUsername(this.game.players, this.currentUser.userName);
        console.log(this.registered);
      })
  }
  leaveGame(){
    console.log('leaving game')
    this.game.players = this.utilsService.removeUserFromArrayByUserId(this.game.players, this.currentUser._id);
    this.saveGame();
  }

  goToMyProfile(){
    this.router.navigateByUrl('/users/'+this.currentUser._id);

  }

  playersPerGroupSelected(playerPerGroup:number){
    console.log(playerPerGroup)
  }

  setNumGroups(numGroups){
    this.addGroupsToGame(numGroups, this.game.playersPerGroup);
  }
  setNumPlayerPerGroup(numPlayers){
    this.addGroupsToGame(this.groupsNum, numPlayers);
  }

  gameTypeSelected(gameType:any){
    console.log(gameType);
    this.game.gameType = gameType
      
      if(this.game.gameType == "1V1"){
        this.addGroupsToGame(2,1);
       
        // this.game.gameGroups[0].groupMembers[0].userName = this.currentUser.userName
        // addPlayerToGroup(0, this.currentUser.userName);
      }
      if(this.game.gameType == "2V2"){
        this.addGroupsToGame(2, 2);
        // this.game.gameGroups[0].groupMembers[0].userName = this.currentUser.userName
      }
      if(this.game.gameType == "1 Vs many"){
        this.game.gameGroups = [];
        this.addGroupsToGame(1, this.game.playersPerGroup);
      }
      if(this.game.gameType == "group Vs group"){
        console.log(this.game.playersPerGroup);
        this.groupsNum = 2
        this.addGroupsToGame(this.groupsNum, this.game.playersPerGroup);
      }
  }

  takeThisPlace(playerIndex:number, groupNum:number){
    console.log(this.registered)
    if(this.registered){
      
      this.gameSwal.title="Oopsy!!";
      this.gameSwal.text="You are allready registered to this tournament";
      this.gameSwal.type="error";
      this.gameSwal.timer = 1000;

      this.gameSwal.fire()
      // this.swal({
      //   title: 'You are allready registered to this tournament',
        
      //   icon: "error",
      //   timer: 1700,
      //   buttons: ['ok']

      // }) 
      return
    } else{
      this.game.gameGroups[groupNum].groupMembers[playerIndex].userName = this.currentUser.userName
      this.joinGame()

    }
    
  }

  removeFromThisPlace(index:number, groupNum:number){
    // console.log(index)
    this.game.gameGroups[groupNum].groupMembers[index].userName = ''
    this.leaveGame();
  }

  addGroupsToGame(numGroups:number, playersPerGroup:number){
    this.game.playersPerGroup = playersPerGroup
    this.game.gameGroups = [];
    
    for (var j=0; j<numGroups; j++){
      var group = {
        groupNumber : j+1,
        groupMembers: []
      }
      for (var i=0; i<playersPerGroup; i++){
        group.groupMembers.push({userName: ''})
      
      }
      this.game.gameGroups.push(group)
    }
    this.game.gameGroups[0].groupMembers[0].userName = this.currentUser.userName;
    // console.log(this.game)
    this.game.maxPlayers = this.game.gameGroups.length * parseInt(this.game.playersPerGroup);
    console.log(this.game.maxPlayers)
  }

  inviteFriendsAndGroups(data){
    console.log(data);
    if(data.friends){
      this.inviteUsers(data.friends)
    }
    if(data.groupsSelected){
      this.inviteGroups(data.groupsSelected)
    }

  }

  inviteUsers(users){
    this.messagesService.sendInvitationMessage('Game', this.game, this.currentUser, users, 'gameInvite')
      .then((createdMessages:any)=> {
        console.log('createdMessages: ', createdMessages)
      })
  }

  inviteGroups(groups:any){
    
    for(var i=0; i< groups.length; i++){
      if(groups[i].members.length > 0){
        console.log(groups[i].groupName)
        this.messagesService.sendInvitationMessage('Game', this.game, this.currentUser, groups[i].members, 'gameInvite')
        .then((createdMessages:any)=> {
          console.log('createdMessages: ', createdMessages)
        })

      }
    }
  }

  sendMessageToPlayers(text){
    this.messagesService.sendMessageToGroup(this.game.players, this.currentUser, text)
      .then((createdMessages:any) => {
        console.log('createdMessages: ', createdMessages)
      })
  }

  
}
