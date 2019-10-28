import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class IonToastService {
    ionToastSubject = new Subject<any>();
}
