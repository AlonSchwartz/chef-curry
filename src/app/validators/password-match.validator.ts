import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.value.password;
        const confirmPassword = control.value.confirm_password;

        // console.log("checking for match")
        if (!password || !confirmPassword) {
            console.log("at least one of the password fields is missing")
            //    console.log("password is " + password)
            //    console.log("confirmPassword is " + confirmPassword)

            return null; // No validation if the fields are missing
        }

        // aAb123@1saqe

        // If the password doesn't match, the form itself is invalid, but the confirm_password field still considered as valid, so we have to change it.
        if (password !== confirmPassword) {
            control.get('confirm_password')?.setErrors({
                passwordMismatch: true
            })
            return { passwordMismatch: true }
        }

        //  If the password does match, and we have an error manualy to confirm_password, we have to remove it
        if (control.get('confirm_password') && control.get('confirm_password')?.hasError('passwordMismatch')) {
            control.get('confirm_password')?.setErrors(null)
        }

        return null;

    };
}
