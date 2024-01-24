import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.value;

        if (!password) {
            return null; // No validation if the field is empty
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
