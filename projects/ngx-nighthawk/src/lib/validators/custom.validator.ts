import { AbstractControl } from '@angular/forms';
import validator from 'validator';

export class NighthawkValidators {
  static mobilePhoneNumber(
    control: AbstractControl
  ): { mobilePhoneNumber: true } | null {
    return validator.isMobilePhone(control.value, 'any', { strictMode: false })
      ? null
      : { mobilePhoneNumber: true };
  }

  static email(control: AbstractControl): { email: true } | null {
    return validator.isEmail(control.value) ? null : { email: true };
  }

  static isPositiveNumber(
    control: AbstractControl
  ): { invalidDestination: true } | null {
    return control.value > 0 ? null : { invalidDestination: true };
  }

  static isCreditCard(control: AbstractControl): { invalidCard: true } | null {
    if (!control.value) return null;
    return !validator.isCreditCard(control.value)
      ? { invalidCard: true }
      : null;
  }
}
