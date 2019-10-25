import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-icon-actions',
  templateUrl: './icon-actions.component.html',
  styleUrls: ['./icon-actions.component.scss']
})
export class IconActionsComponent implements OnInit {
  @Output()action = new Subject<any>();
  @Input() actions:any;
  constructor() { }
  

  ngOnInit() {
    // console.log(this.actions)
  }

  actionClicked(event, actionName){
    console.log(event.path[2]);
    if(event.path[2].classList.contains('rotate')){
      event.path[2].classList.remove('rotate')
    } else{
      event.path[2].classList.add('rotate')

    }
    this.action.next(actionName)
  }

}
