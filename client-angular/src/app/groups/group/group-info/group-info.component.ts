import { Component, OnInit, ViewChild, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { GroupsService } from '../../groups.service';
import { SubSink } from 'node_modules/subsink/dist/subsink'
import { NgForm } from '@angular/forms';
import { PlatformsService } from 'src/app/shared/services/platforms.service';
import { Utils } from 'src/app/shared/services/utils.service';
import { localStorageService } from 'src/app/shared/services/local-storage.service';
import { listAnimation, moveInUp, moveOutRight, moveInLeft} from '../../../shared/animations'
import { MessagesService } from 'src/app/messages/messages.service';

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss'],
  animations: [listAnimation, moveInUp, moveOutRight, moveInLeft]
})
export class GroupInfoComponent implements OnInit, OnChanges, OnDestroy {
  id:string;
  group: any;
  userLoaded: boolean;
  platforms: any;
  actions:any;
  editMode:boolean;
  registered:boolean;
  currentUser: any;
  private subs = new SubSink()
  @ViewChild('groupForm', {static: false}) private groupForm: NgForm;
  
  constructor(private route: ActivatedRoute,
              private platformService: PlatformsService,
              private utilsService: Utils,
              private localStorage: localStorageService,
              private messagesService: MessagesService,
              private groupService:GroupsService,) { }

  ngOnInit() {
    // console.log(window.localStorage)
    // console.log(this.localStorage.get('currentUser'));
    this.currentUser = this.localStorage.get('currentUser');
    this.editMode = false;
    this.actions= [
      {name: 'Edit', color: 'green', icon: 'envelope-open'},
      {name: 'Save', color: 'green', icon: 'user-plus'},
      
      
    ];
    this.userLoaded = false;
    
    this.subs.sink = this.route.parent.params
      .subscribe(
        (params: Params) => {
          // console.log(params)
          this.id = params['groupId'];
          this.subs.sink = this.groupService.getGroupFromDb(this.id)
            .subscribe((group:any) => {
              this.userLoaded = true;
              this.group = group.data
              console.log('group in GroupInfoComponent from server', this.group);
              this.registered = this.utilsService.checkIfUserInArrayByUsername(this.group.members, this.currentUser.userName)

            })
        }
      );

    this.subs.sink = this.platformService.getPlatforms()
      .subscribe((platforms:any) => {
        this.platforms = platforms.data
      })
      
    // this.groupForm.valueChanges.subscribe(
    //     result => console.log(this.groupForm.status)
    // );
    // this.groupForm.statusChanges.subscribe(
    //     result => console.log(result)
    // );
    
    
  }

  ngOnChanges(changes: SimpleChanges){
    console.log(changes)
  }

  flippingButtonClicked(event){
    console.log(event);
    this.onSubmit()
  }

  editGroup(){
    this.editMode = !this.editMode;
  }
  saveGroup(){
    this.subs.sink = this.groupService.editGroup(this.group)
      .subscribe((updatedGroup:any)=>{
        console.log(updatedGroup);
        this.group = updatedGroup.data;
        console.log('updated group: ', this.group);
        this.registered = this.utilsService.checkIfUserInArrayByUsername(this.group.members, this.currentUser.userName)
        if(this.editMode){
          this.editMode = !this.editMode;

        }
      })
  }
 

  onSubmit(){
    console.log(this.groupForm)
  }

  joinGroup(){
    console.log('joining group')
    this.group.members.push({userName: this.currentUser.userName,
                            userId: this.currentUser._id}
                            );
    this.subs.sink = this.messagesService.createLogMessage( 
      'Joined group: '+ this.group.groupName, 
      '',
      this.currentUser, 
      {groupId: this.group._id} 
      )
      .subscribe((createdMessage:any) => {
          console.log('createdLogMessage',createdMessage);
      })
    this.saveGroup();
  }
  leaveGroup(){
    console.log('leavinggroup')
    this.group.members = this.group.members.filter(member => {
      return member.userId !==this.currentUser._id
    })
    this.subs.sink = this.messagesService.createLogMessage( 
      'Left group: '+ this.group.groupName, 
      '',
      this.currentUser, 
      {groupId: this.group._id} 
      )
      .subscribe((createdMessage:any) => {
          console.log('createdLogMessage',createdMessage);
      })
    this.saveGroup();
    this.registered = !this.registered;
  }

  removeMember = function(index){
      
    this.group.members.splice(index, 1);
    console.log(this.group.members);
    this.saveGroup();
  }

  inviteFriends(data){
    this.messagesService.sendInvitationMessage('Group', this.group, this.currentUser, data.friends, 'groupInvite')
      .then((createdMessages:any)=> {
        console.log('createdMessages: ', createdMessages)
      })
  }

  sendMessageToGroup(text){
    this.messagesService.sendMessageToGroup(this.group.members, this.currentUser, text)
    .then((createdMessages:any) => {
      console.log('createdMessages: ', createdMessages)
    })
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
