import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-to-full-screen',
  templateUrl: './to-full-screen.component.html',
  styleUrls: ['./to-full-screen.component.scss']
})
export class ToFullScreenComponent implements OnInit {
  open: boolean;


  @Input() bgColor: string;
  @Input() positionClass: string;

  constructor(private eRef: ElementRef) { }

  ngOnInit() {
    this.open = false;
    // console.log(this)
    this.bgColor = this.bgColor;
    this.positionClass = this.positionClass;
  }

  toggleComponent() {
    console.log(this.open);
    this.open = !this.open;
    // scope.$apply();
}

}
