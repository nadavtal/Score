import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';

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

  



}
