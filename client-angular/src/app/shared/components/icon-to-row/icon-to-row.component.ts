import { Component, OnInit, Input, Output } from '@angular/core';
import { GroupsService } from 'src/app/groups/groups.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-icon-to-row',
  templateUrl: './icon-to-row.component.html',
  styleUrls: ['./icon-to-row.component.scss']
})
export class IconToRowComponent implements OnInit {
  open:boolean = false;
  @Input() bgColor:string;
  @Input() icon:string;
  @Input() positionClass:string;
  @Output() action =  new Subject<any>();
  constructor(private groupsService: GroupsService) { }

  ngOnInit() {
  }

  toggleForm(){
    this.open = !this.open
  }

  yesFunction(data){
    // console.log(data)
    this.action.next(data);
    this.toggleForm()
  }

  

  
}
