import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { strongPasswordValidator } from 'src/app/validators/strong-password.validator';
import { passwordMatchValidator } from 'src/app/validators/password-match.validator';
import { strictEmailValidator } from 'src/app/validators/strict-email.validator';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})

export class LoginDialogComponent {

  register_form: FormGroup;
  login_form: FormGroup
  hasAccount: boolean = true;
  isAuthenticating: boolean = false;
  authMessage = '';

  successfulLogin: boolean | null = null;
  successfulRegister: boolean | null = null;

  /** Validation related variables */
  passwordTooShort: boolean = true;
  passwordWithNoUpperCase: boolean = true;
  passwordWithNoLowerCase: boolean = true;
  passwordWithNoDigit: boolean = true;
  passwordWithNoSymbol: boolean = true;

  passwordVisible: boolean = false;

  formHasValue: boolean = false;

  constructor(private formBuilder: FormBuilder, private auth: AuthService,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar) {

    //In cases where the dialog is opened from a suggestion to login/register
    if (this.data) {
      this.hasAccount = this.data.hasAccount;
    }

    this.register_form = this.formBuilder.group({
      email: new FormControl('', [strictEmailValidator(), Validators.required]),
      passwordGroup: new FormGroup({
        password: new FormControl('', [strongPasswordValidator(), Validators.required]),
        confirm_password: new FormControl('', [Validators.required])
      }, passwordMatchValidator()),
    }, { updateOn: 'change' })

    this.login_form = this.formBuilder.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required])
    }, { updateOn: 'change' })


    this.register_form.valueChanges.subscribe((value) => {

      // Destruct value object and check if there is a value
      const { email, passwordGroup: { password, confirm_password } } = value;
      const hasValue = email || password || confirm_password;
      this.formHasValue = hasValue;
    })

    this.login_form.valueChanges.subscribe((value) => {

      // Destruct value object and check if there is a value
      const { email, password } = value;
      const hasValue = email || password
      this.formHasValue = hasValue
    })

    const passwordControl = this.register_form.get('passwordGroup')?.get('password');

    passwordControl?.statusChanges.subscribe(() => {
      const passwordErrors = passwordControl.errors;
      if (passwordErrors) {
        this.passwordTooShort = passwordErrors['tooShort'];
        this.passwordWithNoUpperCase = passwordErrors['noUpperCase'];
        this.passwordWithNoLowerCase = passwordErrors['noLowerCase'];
        this.passwordWithNoDigit = passwordErrors['noDigit'];
        this.passwordWithNoSymbol = passwordErrors['noSymbol'];
      }
    })
  }

  /**
   * Registers a user by sending the form data to the server for authentication, then
   * handles the response from the server and updates UI accordingly.
   */
  onRegister() {
    if (this.register_form.valid) {
      this.isAuthenticating = true;
      const email = this.register_form.get('email')?.value;
      const password = this.register_form.get('passwordGroup')?.get('password')?.value;

      //send data to server over https
      if (email && password) {
        this.auth.register(email, password).subscribe(res => {
          this.isAuthenticating = false;

          if (res.succussfull) {
            this.successfulRegister = true;
            this.hasAccount = true;
            this.authMessage = res.title;

            // We are updating the size because a confirmation message will appear
            this.dialogRef.updateSize();
          }
          else {
            this.successfulRegister = false;
            this.authMessage = res.message;
          }
        })
      }
    }
  }

  /**
   * Logs in a user by sending the form data to the server for authentication, then
   * handles the response from the server and updates UI accordingly.
   */
  onLogin() {
    this.isAuthenticating = true;
    const email = this.login_form.get('email')?.value;
    const password = this.login_form.get('password')?.value;

    if (email && password) {
      this.auth.login(email, password).subscribe(res => {
        this.isAuthenticating = false;

        if (res.succussfull) {
          this.successfulLogin = true;
          this.dialogRef.close()
          this._snackBar.open("You're now logged in", "", {
            duration: 1500
          })
        }
        else {
          this.successfulLogin = false;

          if (res.message) {
            this.authMessage = res.message;
          }
        }
      })
    }
  }

  /**
   * Switches login form to registeration, and vice versa
   */
  switchForm() {
    this.hasAccount = !this.hasAccount;
    this.authMessage = '';
    this.successfulLogin = null;
    this.successfulRegister = null;
    this.passwordVisible = false;
  }

  /**
   * Ensures the tooltip remains visible when the button is clicked by preventing
   * the click event from propagating to other elements. 
   *
   * @param event The click event triggered by the button click.
   */
  keepTooltipVisible(event: Event) {
    event.stopPropagation(); // Prevent bubbling up to input field
  }

  /**
   * Toggles the visibility of the password field.
   */
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
