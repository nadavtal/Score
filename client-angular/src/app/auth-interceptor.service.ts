import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { localStorageService } from './shared/services/local-storage.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService,
                private localStorage: localStorageService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        // console.log('req on its way', req);
        let currentUser = this.localStorage.get('currentUser');
        let token = this.localStorage.get('token');
        
        if(currentUser && token){
            req = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              });
        } else{
            console.log('there is no user in authentication intercepater')
        }
        // console.log(req);
        return next.handle(req)
    }

    
}