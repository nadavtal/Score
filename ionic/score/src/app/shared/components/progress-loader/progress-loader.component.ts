import { Component, OnInit } from '@angular/core';
import { ProgressService } from './progressLoader.service';

@Component({
  selector: 'app-progress-loader',
  templateUrl: './progress-loader.component.html',
  styleUrls: ['./progress-loader.component.scss'],
  
  
})
export class ProgressLoaderComponent implements OnInit {
  progressMsg: string = 'Loading...'
  loading: boolean = true;
  constructor(private progressService: ProgressService) { }

  ngOnInit() {
    this.progressService.progressMsg
      .subscribe(msg => {
        console.log(msg)
        this.progressMsg = msg
      });
    
    this.progressService.loading
      .subscribe(loading => {
        console.log(loading)
        this.loading = loading
      })

  }

}
