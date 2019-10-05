import { Injectable } from '@angular/core';
import { QueryService } from 'src/app/shared/services/query.service';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ClashRoyaleService {
    constructor(private query:QueryService){}
    clashUser = new Subject<any>()

    getClashUser(usertag) {
    if (!usertag) return;
    var reparedUserId = '%23'+ usertag.slice(1, usertag.length)
    return this.query.get('clashusers/'+reparedUserId)

    /// definitions
    }
  
    getClashUserFromDb(usertag) {
    if (!usertag) return;
    console.log(usertag);
    var reparedUserId = '%23'+ usertag.slice(1, usertag.length)
    return this.query.get('clashusers/'+reparedUserId+'/battles')

    /// definitions
    }
    getClashUserBattles(userTag) {
    // console.log('alksdlaksjdlakjsdd')
    var reparedUserId = '%23'+ userTag.slice(1, userTag.length)
    if (!reparedUserId) return;
    return this.query.get('clashusers/'+reparedUserId+'/battles')

    /// definitions
    }

    getAllClashUsers(){
    return this.query.get('clashusers/')
    }
}