import { AbstractControl } from '@angular/forms';


export class CustomValidators {

    nameValidator(control: AbstractControl): {[key: string] : any} | null{
        const forbidden = /admin/.test(control.value);
        return forbidden ? {'forbiddenName' : {value:control.value}} : null;
    }

    // forbiddenNames(control: FormControl): {[s: string]: boolean}{
    //     if(this.forbiddenUserNames.indexOf(control.value) !== -1){
    //       return { 'forbidden' : true}
    //     }
    //     return null
    //     //if validation is successful you have to reuturn nothing or null
    //   }
    
    //   forbiddenEmails(control: FormControl) : Promise<any> | Observable<any>{
    //     const promise = new Promise<any>((resolve, reject) => {
    //       setTimeout(() => {
    //         if(control.value === 'test'){
    //           resolve({'forbidden' : true})
    //         } else{
    //           resolve(null)
    //         }
    //       }, 1000)
    //     })
    //     return promise
    //   }

}