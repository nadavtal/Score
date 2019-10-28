import { Component, OnInit, ViewChild, Inject, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlatformsService } from 'src/app/shared/services/platforms.service';
import { QueryService } from 'src/app/shared/services/query.service';
import { GroupsService } from '../../groups.service';
import { localStorageService } from 'src/app/shared/services/local-storage.service';

export interface DialogData {
  currentUser: any;
  
}



@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {
  platforms: any;
  currentUser: any = this.localStorage.get('currentUser')
  
  @ViewChild('groupForm', {static: false}) private groupForm: NgForm;
  constructor(
    private localStorage: localStorageService,
    private platformService: PlatformsService,
    private groupsService: GroupsService){}
    // public dialogRef: MatDialogRef<GroupFormComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    // this.dialogRef.close();
  }

  ngOnInit() {
    
    this.platformService.getPlatforms()
      .subscribe((platforms:any) => {
        this.platforms = platforms.data
      })
  }

  onSubmit(){
    console.log(this.groupForm.value);
    let newGroup = this.groupForm.value;
    newGroup.groupManager = {userName: this.currentUser.userName,
                            userId: this.currentUser._id};
    newGroup.members = [{userName: this.currentUser.userName,
                        userId: this.currentUser._id}]
    this.groupsService.createGroup(this.groupForm.value)
      .subscribe((newGroup:any) =>{
        console.log(newGroup.data);
        // this.dialogRef.close();
        this.groupsService.newGroupCreated.next(newGroup.data)
      })
  }

}
