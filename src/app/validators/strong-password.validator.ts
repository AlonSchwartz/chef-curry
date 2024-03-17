import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.value;

        //RIGHT NOW, IT DOESNT CHECK FOR SPACES IN THE PASSWORD.

        //In case there is no password, trigger all validation errors
        if (!password) {
            return {
                weakPassword: true,
                noUpperCase: true,
                noLowerCase: true,
                noDigit: true,
                noSymbol: true,
                tooShort: true
            }
        }

        // add a check that there is no space in the password
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);
        const hasLength = password.length >= 8;

        const valid = hasUpperCase && hasLowerCase && hasDigit && hasSymbol && hasLength;

        if (!valid) {
            return {
                weakPassword: true,
                noUpperCase: !hasUpperCase,
                noLowerCase: !hasLowerCase,
                noDigit: !hasDigit,
                noSymbol: !hasSymbol,
                tooShort: !hasLength
            }
        }

        return null;
    };
}
