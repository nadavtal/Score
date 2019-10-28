import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-three-d-button',
  templateUrl: './three-d-button.component.html',
  styleUrls: ['./three-d-button.component.scss']
})
export class ThreeDButtonComponent implements OnInit {
  
  @Input() condition:boolean;
  @Input() actionTrueName:string;
  @Input() actionFalseName:string;
  @Input() actionTrueIconName:string;
  @Input() actionFalseIconName:string;
  @Input() actionTrueFunction:any;
  @Input() actionFalseFunction:any;
  @Input() trueColor:string;
  @Input() falseColor:string;
  @Input() iconSizeClass:string;
  @Output()
  threeDActionEmmiter = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    // console.log(this.condition, this.actionTrueIconName, this.actionFalseIconName)
  }

  buttonClicked($event){
    // console.log(this.condition);
    if(this.condition){
      this.actionTrueFunction()
    } else{
      this.actionFalseFunction()
    }
    
  }


}
