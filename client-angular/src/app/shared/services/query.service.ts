import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({providedIn: 'root'})
export class QueryService{
    rootUrl: string = environment.rootUrl;
    rootClashUrl: string = environment.rootClashUrl;
    error = new Subject<string>();
    constructor(private http: HttpClient,
                ){};
    
    get(endPoint:string, getParams?: {}){
        if(getParams){
            console.log(getParams)
            
            let params =  new HttpParams();
            // params = params.append(getParams);
        }
        // console.log(this.http)
        return this.http.get(this.rootUrl+endPoint)
            
    };
    post(endPoint:string, data: {}){
        
        return this.http.post(this.rootUrl+endPoint,data)
            
    }
    put(endPoint:string, data: {}){
        
        return this.http.put(this.rootUrl+endPoint,data)
            
    }

    clashRoyaleQuery(endPoint:string){
        console.log('aksjdhkajsdhkajhdskjahskdj')
        const url = this.rootClashUrl + endPoint;
        console.log(url)
        const headers = {
            headers: new HttpHeaders({
                'Accept':'application/json',
                'Access-Control-Request-Headers': 'authorization',
                'Access-Control-Request-Method': 'GET',
                'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdiODAyNDE4LWQxN2EtNGQ3Ni1iZGQyLTNhMzUzMWJhZTdjYiIsImlhdCI6MTU2MzUzMTM2Nywic3ViIjoiZGV2ZWxvcGVyLzJjOTg4MjcxLTMwYzktZmQ1ZS03YWQyLTQ1Yzg3YTYxZWIwNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIyMTMuNTcuMjQ2LjQ0Il0sInR5cGUiOiJjbGllbnQifV19.eBzA0OArr0ag9xGuDZVkhId5X7m44gIPI67gL5xDRjF4O86lWwn2IPWpLqH54nAvIxeKq4hvC6u29TFyeKpi-A'
            })
        }

        console.log(headers)
        

        return this.http.get(url, headers)
    }

}