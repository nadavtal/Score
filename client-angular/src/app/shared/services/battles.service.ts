import { Injectable } from '@angular/core';
import { QueryService } from './query.service';

@Injectable({providedIn: 'root'})
export class BattlesService{

    constructor(private query:QueryService){}

    getAllBattles(){
        return this.query.get('battles')
    }

    getBattlesByClanTag(clanTag:string){
        return this.query.get('battles/'+ clanTag)
    }
}