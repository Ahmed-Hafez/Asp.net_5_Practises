import { ValidatorFn, AbstractControl } from '@angular/forms';

export function isMatching(matchTo: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control?.value === control?.parent?.controls[matchTo].value
      ? null
      : { isMatching: true };
  };
}
