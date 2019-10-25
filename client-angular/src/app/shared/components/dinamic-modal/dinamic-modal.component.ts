import { Component, OnInit , Inject, Input} from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GroupFormComponent } from 'src/app/groups/group/group-form/group-form.component';

export interface DialogData {
  
}

@Component({
  selector: 'app-dinamic-modal',
  templateUrl: './dinamic-modal.component.html',
  styleUrls: ['./dinamic-modal.component.scss']
})
export class DinamicModalComponent implements OnInit {
  @Input() componentName:string
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(GroupFormComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dinamic-modal-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
