import { Directive } from '@angular/core';
import { FormControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validateName][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useValue: NameValidator, multi: true }
  ]
})
export class NameValidator {
    forbiddenUserNames = ['nad', 'gad']

    forbiddenNames(control: FormControl): {[s: string]: boolean}{
        console.log('validating name')
            if(this.forbiddenUserNames.indexOf(control.value) !== -1){
              return { 'forbidden' : true}
            }
            return null
            //if validation is successful you have to reuturn nothing or null
          }
}
