import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-flipping-button',
  templateUrl: './flipping-button.component.html',
  styleUrls: ['./flipping-button.component.scss']
})
export class FlippingButtonComponent implements OnInit {

@Input() condition:boolean;

@Input() actionOneName:string;
@Input() actionTwoName:string;
@Output()
  action = new EventEmitter<any>()

  constructor() { }

  ngOnInit() {
    // console.log(this.condition, this.actionOneName);
   
  }

  ifTrue(event){
    console.log(this.condition)
    this.condition = !this.condition
    
    this.action.emit('trueFunction');
  }
  ifFalse(event){
    console.log(this.condition)
    this.condition = !this.condition
    
    this.action.emit('falseFunction');
  }


 

}
