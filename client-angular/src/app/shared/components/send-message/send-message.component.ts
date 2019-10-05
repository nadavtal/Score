import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {
  open:boolean = false;
  @Input() bgColor:string
  constructor() { }

  ngOnInit() {
    console.log(this.bgColor)
  }

  toggleForm(){
    this.open = !this.open
  }

  sendMessage(message){
    console.log(message);
    this.open = !this.open
  }

}
