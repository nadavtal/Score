import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-switch-check-box',
  templateUrl: './switch-check-box.component.html',
  styleUrls: ['./switch-check-box.component.scss']
})
export class SwitchCheckBoxComponent implements OnInit {
  checked: boolean;
  @Input() ifCheckedFunction: any;
  @Input() ifUnCheckedFunction: any;
  constructor() { }

  ngOnInit() {
    this.checked = true;
  }

  clicked() {
                
    if(this.checked){
        this.checked = false;
        this.ifCheckedFunction();
    } else{
        this.checked = true;
        this.ifUnCheckedFunction()
    }
   }

}
