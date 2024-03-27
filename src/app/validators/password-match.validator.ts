import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirm_password')?.value;

        if (!password || !confirmPassword) {
            return null; // No validation if the fields are missing
        }

        // If the passwords doesn't match, the form itself is invalid, but the confirm_password field still considered as valid, so we have to change it.
        if (password !== confirmPassword) {
            control.get('confirm_password')?.setErrors({
                passwordMismatch: true
            })
            return { passwordMismatch: true }
        }

        //In case the passwords does match, we remove errors (if there are any)
        else {
            control.get('confirm_password')?.setErrors(null)
            return null;
        }
    };
}
