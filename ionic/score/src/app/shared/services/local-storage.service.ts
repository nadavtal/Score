import { Injectable, OnInit } from '@angular/core';


@Injectable({providedIn: 'root'})
export class localStorageService implements OnInit{
    storage:any;
    supported:any
    constructor(){
        
    }

    ngOnInit(){
        this.storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;
       
        // this.supported = (typeof this.storage === undefined);
        
    }

    set(name:string, val:any) {
        // console.log('storage', this.supported);
        // if (!this.supported)
        //   console.log('localStorage not supported, make sure you have the $cookies supported.');
  
        // in case we already have localStorage with same name alert error msg
        if (window.localStorage.getItem(name) !== null)
          console.log('localStorage with the name ' + name + ' already exists. Please pick another name.');
        else
        // console.log(name, val)
           window.localStorage && window.localStorage.setItem(name, JSON.stringify(val));
  
      };

    get(name:string) {
        // if (!this.supported)
        //   console.log('localStorage not supported, make sure you have the $cookies supported.');
          
        
        return window.localStorage && JSON.parse(window.localStorage.getItem(name));
      }

    update(name:string, val:any) {
        // if (!this.supported)
        //   console.log('localStorage not supported, make sure you have the $cookies supported.');
  
         window.localStorage && window.localStorage.setItem(name, JSON.stringify(val));
      }
    remove(name:string) {
        
      window.localStorage && window.localStorage.removeItem(name);
      }

    

}