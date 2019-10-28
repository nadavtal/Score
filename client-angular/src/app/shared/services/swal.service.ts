import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class SwalService {
    swal = new Subject<any>()
    loginSwal = new Subject<any>()
}