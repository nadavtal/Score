import { Injectable } from '@angular/core';
import { QueryService } from '../shared/services/query.service';

@Injectable({providedIn: 'root'})
export class AuthService {

    constructor(private query: QueryService){}

    signUp(){
        
    }
    login(data:any){
        return this.query.post('users/authenticate', data)
    }
    logout(){

    }

}