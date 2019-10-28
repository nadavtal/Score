import { OnInit, Injectable } from '@angular/core';
import { QueryService } from './query.service';

@Injectable({providedIn: 'root'})
export class PlatformsService  {

    constructor(private query: QueryService){};

    getPlatforms(){
       return this.query.get('platforms')
      
    }
}