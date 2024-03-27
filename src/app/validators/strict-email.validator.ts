import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export function strictEmailValidator(): ValidatorFn {
    const allowedDomains: string[] = ['com', 'co.il'];

    return (control: AbstractControl): { [key: string]: any } | null => {
        const emailValue: string | null = control.value;

        if (!emailValue) {
            return null; // No validation if the field is empty
        }

        const emailValidator = Validators.email(control)

        // If the email address is valid according to the built-in validator, apply more strict rules to check
        if (emailValidator == null) {
            const atIndex = emailValue.indexOf('@');
            const localPart = emailValue.slice(0, atIndex)
            const domainPart = emailValue.slice(atIndex + 1)

            const dotIndex = domainPart.indexOf('.');

            const InvalidChars_regex = /[^a-zA-Z0-9.+_\-]/; //Any characater that is not a letter, number, or allowed special character
            const invalidPart = InvalidChars_regex.test(localPart)

            if (invalidPart) {
                return { invalidEmail: true };
            }

            //In case there is no dot or at(@) sign
            if (atIndex <= 0 || dotIndex <= 0) {
                return { invalidEmail: true };
            }

            //In case the top level domain isn't allowed
            const topLevelDomain = domainPart.substring(dotIndex + 1).toLowerCase();
            if (!allowedDomains.includes(topLevelDomain)) {
                return { invalidDomain: true };
            }
        }

        else {
            // In case the built-in email validator found errors
            return { invalidDomain: true };
        }

        return null;
    };
}
