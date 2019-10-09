import { Component, OnInit, Input, HostListener, ElementRef, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnInit {
  @Input() actions:{}
  @Input() positionClass:string;
  @Input() triggerIconName:string;
  @Input() toolBarColor:string;
  @Input() color:string;
  open:boolean;
  @Output() action = new Subject<any>()
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(!this.eRef.nativeElement.contains(event.target) && this.open) {
      
      this.toggleToolBar();
    } 
  }
  constructor(private eRef: ElementRef) { }

  ngOnInit() {
    this.open = false
    // console.log(this.actions)
  }

  toggleToolBar(){
    
    this.open = !this.open
  }

  toolBarActionClicked(event){
    this.open = false
    this.action.next(event)
  }

  



}
