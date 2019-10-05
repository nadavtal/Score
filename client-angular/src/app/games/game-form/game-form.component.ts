import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss']
})
export class GameFormComponent implements OnInit {
  gameForm: FormGroup;
  constructor() { }

  ngOnInit() {
  }

  private initForm(){
    this.gameForm = new FormGroup({
      'name': new FormControl()
    })
  }

}
