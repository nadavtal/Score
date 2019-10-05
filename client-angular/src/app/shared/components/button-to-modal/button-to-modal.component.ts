import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-button-to-modal',
  templateUrl: './button-to-modal.component.html',
  styleUrls: ['./button-to-modal.component.scss']
})
export class ButtonToModalComponent implements OnInit {
  @Input() dataDirection: string;
  @Input() message: string;
  @Input() actionName: string;
  @Input() condition: boolean;
  @Input() ifTrueFunction: any;
  @Input() ifFalseFunction: any;
  @ViewChild('button', {static: false}) button: ElementRef;
  constructor() { }

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
    


  }

  mainFunction(){
    //  console.log('main function', this.condition);
     if(this.condition == true){
      this.ifTrueFunction();
     }  else{
      this.ifFalseFunction()
     }        
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
    const buttonElement = this.button.nativeElement;
    buttonElement.classList.remove('is-open');
  }


}
