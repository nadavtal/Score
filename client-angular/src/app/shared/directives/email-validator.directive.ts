// import { Directive, forwardRef } from '@angular/core';
// import { NG_VALIDATORS, FormControl } from '@angular/forms';
// import { EmailBlackList } from '../services/email-black-list.service';

// function validateEmailFactory(emailBlackList: EmailBlackList) {
//   return (c: FormControl) => {
//     let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

//     return EMAIL_REGEXP.test(c.value) ? null : {
//       validateEmail: {
//         valid: false
//       }
//     };
//   };
// }

// @Directive({
//   selector: '[validateEmail][ngModel],[validateEmail][formControl]',
//   providers: [
//     { provide: NG_VALIDATORS, useExisting: forwardRef(() => EmailValidator), multi: true }
//   ]
// })
// export class EmailValidator {

//   validator: Function;

//   constructor(emailBlackList: EmailBlackList) {
//     this.validator = validateEmailFactory(emailBlackList);
//   }

//   validate(c: FormControl) {
//     return this.validator(c);
//   }
// }