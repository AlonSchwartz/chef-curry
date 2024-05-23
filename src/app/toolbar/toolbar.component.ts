import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { ChefMessagesComponent } from '../dialogs/chef-messages/chef-messages.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(public dialog: MatDialog,
    private auth: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar) { }

  isLoggedIn = this.auth.getLoggedInSignal();

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.auth.validateStoredTokens().subscribe(response => {
        if (!response.successful) {
          this.logout();
        }
      });
    }
  }

  /**
   * Opens a dialog for user authentication, allowing users to login or to register.
   */
  openAuthDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      disableClose: true
    })

    // Handles in case of clicks outside the dialog
    dialogRef.backdropClick().subscribe(() => {
      if (dialogRef.componentInstance.successfulRegister) {
        dialogRef.close()
        return;
      }

      if (dialogRef.componentInstance.formHasValue) {
        this.askForConfirmation().then(toClose => {

          if (toClose) {
            dialogRef.close()
          }
        })
      }
      else {
        dialogRef.close()
      }
    })

    // Handles in case of ESC button pressed
    dialogRef.keydownEvents().subscribe(event => {
      if (dialogRef.componentInstance.successfulRegister) {
        dialogRef.close()
        return;
      }

      if (event.key === "Escape") {
        if (dialogRef.componentInstance.formHasValue) {
          this.askForConfirmation().then(toClose => {

            if (toClose) {
              dialogRef.close()
            }
          })
        }
        else {
          dialogRef.close()
        }
      }
    })

  }

  /**
   * opens dialog which asks for confirmation whether to close the form or not
   * @returns promise that contains the answer
   */
  askForConfirmation() {
    return new Promise((resolve, reject) => {
      const confiramtionDialogRef = this.dialog.open(ChefMessagesComponent, {
        data: {
          type: "confiramtion"
        },
        disableClose: true,
        autoFocus: false
      });

      confiramtionDialogRef.afterClosed().subscribe(res => {
        if (res.toClose) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  /**
   *  Initiates a user logout process.
   */
  logout() {
    this.auth.logout().subscribe(response => {
      if (response.successful) {
        this.router.navigate(['/'])
      }
      else {
        this._snackBar.open("Logout failed", "", {
          duration: 1500
        })
      }
    })
  }

  /**
   * Opens favorites page
   */
  openFavorites() {
    this.router.navigate(['favorites'])
  }
}