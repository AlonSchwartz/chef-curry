import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

//TODO: Add a check that the email doesnt contain specail characters like / % etc
export function strictEmailValidator(): ValidatorFn {
    const allowedDomains: string[] = ['com', 'co.il'];
    console.log("Starting to check.............")

    return (control: AbstractControl): { [key: string]: any } | null => {
        const emailValue: string | null = control.value;
        const allowedSpecialCharacters = ['.', '-', '_', '+'];


        if (!emailValue) {
            return null; // No validation if the field is empty
        }

        console.log("emailValue exists")

        const emailValidator = Validators.email(control)

        // If the email address is valid according to the built-in validator, apply more strict rules to check
        if (emailValidator == null) {
            const atIndex = emailValue.indexOf('@');
            const localPart = emailValue.slice(0, atIndex)
            const domainPart = emailValue.slice(atIndex + 1)
            console.log("domain part is " + domainPart)

            const dotIndex = domainPart.indexOf('.');
            console.error("atIndex is " + atIndex + " and dotIndex is " + dotIndex)

            const InvalidChars_regex = /[^a-zA-Z0-9.+_\-]/; //Any characater that is not a letter, number, or allowed special character
            const invalidPart = InvalidChars_regex.test(localPart)
            /*
                const test = /[^.+_\-]/.test(localPart)
                const test2 = /[^a-z]/.test(localPart)
                const test3 = /[^A-Z]/.test(localPart)
                const test4 = /[^0-9]/.test(localPart)
                
                if (test && test2 && test3 && test4) {
                    console.log("All tests are true. meaning there is unvalid value inside")
                    return { invalidEmail: true };
                }
    */
            console.log(emailValue)
            console.log("regex = " + invalidPart)

            if (invalidPart) {
                console.log("regex is true " + invalidPart)
                return { invalidEmail: true };
            }

            //In case there is no dot or at sign
            if (atIndex <= 0 || dotIndex <= 0) { //|| dotIndex <= atIndex
                console.log("location not right")
                return { invalidEmail: true };
            }

            //In case the top level domain isn't allowed
            const topLevelDomain = domainPart.substring(dotIndex + 1).toLowerCase();
            if (!allowedDomains.includes(topLevelDomain)) {
                console.log("Invalid Domain " + topLevelDomain)
                return { invalidDomain: true };
            }


            // const regexPattern = `[^${allowedSpecialCharacters.join('')}]`;
        }

        else {
            //email address is not valid
            return { invalidDomain: true };
        }

        return null;
    };
}
