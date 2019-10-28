import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-button-to-modal',
  templateUrl: './button-to-modal.component.html',
  styleUrls: ['./button-to-modal.component.scss']
})
export class ButtonToModalComponent implements OnInit {
  @Input() dataDirection: string;
  @Input() formName: string;
  @Input() message: string;
  @Input() actionName: string;
  @Input() condition: boolean;
  @Input() ifTrueFunction: any;
  @Input() ifFalseFunction: any;
  @ViewChild('form', {static: false}) private form: NgForm;
  @ViewChild('button', {static: false}) button: ElementRef;
  isOpen: boolean = false;
  isflipped:boolean = false

  @HostListener('document:click', ['$event'])
  clickout(event) {
    const target = event.target as HTMLElement;
    if(!this.eRef.nativeElement.contains(target) && this.isOpen) {
      console.log('alskjdlaskjd')
      this.cancelFunction();
    } 
  }
  constructor(private eRef: ElementRef) { }

  ngOnInit() {
    
  }

  distance( x1, y1, x2, y2 ) {
    var dx = x1-x2;
    var dy = y1-y2;
    return Math.sqrt( dx*dx + dy*dy );
  }

  frontClick(event){
    const distance = this.distance;
    const buttonElement = this.button.nativeElement;
    console.log(buttonElement);
    // console.log(event);
    // console.log(buttonElement);
    var mx = event.clientX - buttonElement.offsetLeft,
          my = event.clientY - buttonElement.offsetTop;
    
      var w = buttonElement.offsetWidth,
          h = buttonElement.offsetHeight;
      
      var directions = [
        { id: 'top', x: w/2, y: 0 },
        { id: 'right', x: w, y: h/2 },
        { id: 'bottom', x: w/2, y: h },
        { id: 'left', x: 0, y: h/2 }
      ];
      
      directions.sort( function( a, b ) {
        
        return distance( mx, my, a.x, a.y ) - distance( mx, my, b.x, b.y );
      } );
      this.dataDirection = directions.shift().id;
      // buttonElement.setAttribute( 'data-direction', directions.shift().id );
      buttonElement.classList.add('is-open');
      this.isOpen = true
    console.log('finishedfrontclick')


  }

  openConfirm(){
    
    this.isflipped = true
    const buttonElement = this.button.nativeElement;
    buttonElement.classList.add('confirm')
  }
  closeConfirm(){
    
    this.isflipped = false
    const buttonElement = this.button.nativeElement;
    buttonElement.classList.remove('confirm')
  }

  mainFunction(){
     console.log('main function', this.condition);
     if(this.condition == true){
      this.ifTrueFunction(this.form.value);
     }  else{
      this.ifFalseFunction()
     }  
     this.cancelFunction()      
    // if(scope.condition == 'true'){
    //   scope.ifTrueFunction();
    //   scope.condition = 'false';
    //   allocateByCondition()
    // } else{
    //   scope.ifFalseFunction();
    //   scope.condition = 'true';
    //   allocateByCondition()
    // }
    // button.removeClass( 'is-open' );
    
  }

  cancelFunction(){
    console.log('cancel')
    const buttonElement = this.button.nativeElement;
    buttonElement.classList.remove('is-open');
    buttonElement.classList.remove('confirm');
    this.isOpen = false
    this.isflipped = false
  }


}
