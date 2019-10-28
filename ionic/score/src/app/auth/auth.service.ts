import { Injectable } from '@angular/core';
import { QueryService } from '../shared/services/query.service';
import { catchError } from 'rxjs/operators'
import { throwError, Subject } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new Subject<any>()
    constructor(private query: QueryService){}

    signUp(userData:any){
        return this.query.post('users/', userData)
        .pipe(catchError(this.handleError))
    }
    login(data:any){
        return this.query.post('users/authenticate', data)
        .pipe(catchError(this.handleError))
    }
    logout(){

    }

    private handleError(errorRes: HttpErrorResponse) {
        console.log(errorRes)
        let errorMessage = 'An unknown error accured';
        if(!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage)
        }
        switch (errorRes.error.error.detail){
            case '': errorMessage = ''
        }
        return throwError(errorRes.error.error.detail)
    }

}