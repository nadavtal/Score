import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { GroupFormComponent } from 'src/app/groups/group/group-form/group-form.component';
import { NgForm } from '@angular/forms';
import { PlatformsService } from '../../services/platforms.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sweet-alert',
  templateUrl: './sweet-alert.component.html',
  styleUrls: ['./sweet-alert.component.scss']
})
export class SweetAlertComponent implements OnInit {
  @ViewChild('form', {static: false}) private form: NgForm;
  
  @Input() formName: string;
  @Input() formTitle: string;
  @Input() actionName: string;
  @Output()confirmed = new Subject<any>();
  platforms:any;
  constructor(
      public readonly swalTargets: SwalPortalTargets,
      public platformService: PlatformsService,
      ) { }

  ngOnInit() {
    // console.log(this.formName);
    
    this.platformService.getPlatforms()
      .subscribe((platforms:any) => {
        this.platforms = platforms.data;
    })
    
  }

  modalConfirmedClicked(){
    console.log(this.formName)
    console.log(this.form.value);
    // this.confirmed.next({formName: this.formName, formValues: this.form.value})
    this.confirmed.next({action: this.formName, values: this.form.value})
  //   switch(this.formName) { 
  //     case 'createGameForm': { 
  //        console.log('creating game');
  //        break; 
  //     } 
  //     case 'createGroupForm': { 
  //        console.log('creating Group')
  //        break; 
  //     } 
  //     case 'createTournamentForm': { 
  //        console.log('creating tournament')
  //        break; 
  //     } 
      
  //  } 
    
    
  }

}
