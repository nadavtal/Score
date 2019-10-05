import {  Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { QueryService } from '../shared/services/query.service';

@Injectable({providedIn: 'root'})
export class TournamentsService {
    constructor(private query: QueryService){}
    tournamentSelected = new Subject<any>();
    

    getAllTournaments(){
        return this.query.get('tournaments')
    }

    getTournament(tournamentId) {
        if (!tournamentId) return;
  
        return this.query.get('tournaments/' + tournamentId)
    }

    getTournamentsByUserID(userId:string){
        return this.query.get('tournaments/user/'+userId)
    }

    getTournamentsManagedByUserName(userName, getParams){
        console.log(getParams)
        return this.query.get('tournaments/user/managed/'+userName, getParams)
    }
    getTournamentsByGroupID(groupId:string){
        return this.query.get('tournaments/group/'+groupId)
    }
    editTournament(tournament:any){
        return this.query.put('tournaments/'+tournament._id, tournament)    }


    
}