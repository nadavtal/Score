import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit, OnChanges {
  @Input() title:string;
  @Input() actions:any;
  @Input() editMode:string;
  @Input() showThreeDButton:boolean;
  @Input() showModalButton:boolean;
  @Input() formName:string;
  @Output()
  action = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    console.log(this.editMode)
    this.title = this.title;
  }

  ngOnChanges(changes: SimpleChanges){
    console.log(changes)
  }

  threeDButtonClicked(action:string){
    console.log(action)
    this.action.emit(action);
  }

  actionClicked(event){
    this.action.emit(event)
  }

}
