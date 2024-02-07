import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { strongPasswordValidator } from 'src/app/validators/strong-password.validator';
import { passwordMatchValidator } from 'src/app/validators/password-match.validator';
import { strictEmailValidator } from 'src/app/validators/strict-email.validator';
import { MatTooltip } from '@angular/material/tooltip';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Recipe } from 'src/app/interfaces/recipe.interface';


@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent {

  hasAccount: boolean = true;
  register_form: FormGroup; // Create a form group
  login_form: FormGroup//
  isLoggingIn: boolean = false;
  isRegistering: boolean = false;
  registrationMessage = '';
  loginMesseage = '';

  failedLogin: boolean | null = null;
  isRegistrationSuccessful: boolean | null = null;

  test2: boolean = false;

  passwordTooShort: boolean = true;
  passwordWithNoUpperCase: boolean = true;
  passwordWithNoLowerCase: boolean = true;
  passwordWithNoDigit: boolean = true;
  passwordWithNoSymbol: boolean = true;

  constructor(private formBuilder: FormBuilder, private auth: AuthService,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data) {
      this.hasAccount = this.data.hasAccount;
    }

    this.register_form = this.formBuilder.group({
      email: new FormControl('', [strictEmailValidator(), Validators.required]),
      passwordGroup: new FormGroup({
        password: new FormControl('', [strongPasswordValidator(), Validators.required]),
        confirm_password: new FormControl('', [Validators.required])
      }, passwordMatchValidator()),
      // password: new FormControl('', [strongPasswordValidator(), Validators.required]),
      //  confirm_password: new FormControl('', [passwordMatchValidator(), Validators.required])
    }, { updateOn: 'change' }) // The error message will appear once the user has finished typing
    this.login_form = this.formBuilder.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required])
    }, { updateOn: 'change' })

    this.register_form.valueChanges.subscribe((value) => {
      console.log(value)

    })
    this.register_form.get('passwordGroup')?.statusChanges.subscribe((value) => {
      console.log(value)
      const passwordErrors = this.register_form.get('passwordGroup')?.get('password')?.errors;
      console.log(passwordErrors)

      if (passwordErrors) {
        if (passwordErrors['required']) {
          this.passwordTooShort = true;
          this.passwordWithNoUpperCase = true;
          this.passwordWithNoLowerCase = true;
          this.passwordWithNoDigit = true;
          this.passwordWithNoSymbol = true;
        }
        else {
          this.passwordTooShort = passwordErrors['tooShort'];
          this.passwordWithNoUpperCase = passwordErrors['noUpperCase'];
          this.passwordWithNoLowerCase = passwordErrors['noLowerCase'];
          this.passwordWithNoDigit = passwordErrors['noDigit'];
          this.passwordWithNoSymbol = passwordErrors['noSymbol'];
        }
      }
    })
  }

  onRegister() {
    if (this.register_form.valid) {

      console.log(this.register_form)
      this.isRegistering = true;
      const email = this.register_form.get('email')?.value;
      const password = this.register_form.get('passwordGroup')?.get('password')?.value;

      //send data to server over https
      if (email && password) {
        const registerAttempt = this.auth.register(email, password).subscribe(res => {

          console.log("I got an answer, which is ")
          console.log(res)
          if (res.succussfull) {
            this.registrationMessage = res.title;
            this.isRegistrationSuccessful = true;
            this.hasAccount = true;
            console.log(document.cookie)

            this.saveInLocalStorage(email, [])
            this.dialogRef.updateSize();

          }
          else {
            this.registrationMessage = res.message;
            this.isRegistering = false;
            this.isRegistrationSuccessful = false;
          }
        })
      }

    }


  }

  onLogin() {
    console.log(this.login_form)
    const email = this.login_form.get('email')?.value;
    const password = this.login_form.get('password')?.value;
    this.isLoggingIn = true;
    //send data to the server over https
    //in case the details are wrong, change failedLogin to true.

    if (email && password) {
      const loginAttempt = this.auth.login(email, password).subscribe(res => {
        console.log("Works?!!?!?!")
        console.log(res)

        if (res.succussfull) {
          this.isLoggingIn = false;
          this.failedLogin = false;
          let recipes = [];
          if (res.recipes) {
            recipes = res.recipes;
          }

          //save basic user info on localStorage
          this.saveInLocalStorage(email, recipes);

          this.dialogRef.close()
        }
        else {
          this.failedLogin = true;
          this.isLoggingIn = false;

          console.log(res)
          if (res.message) {
            this.loginMesseage = res.message;
          }
        }
      })

    }
  }

  showTooltip(tool: MatTooltip) {
    // tool.show()
    // console.log(tool)
  }

  test() {

  }

  saveInLocalStorage(email: string, recipes: Recipe[]) {
    const userInfo = {
      "loggedIn": true,
      "email": email
    }

    localStorage.setItem("userInfo", JSON.stringify(userInfo))
    localStorage.setItem("recipes", JSON.stringify(recipes))

  }
}
