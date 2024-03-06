import { Component, OnInit, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(public dialog: MatDialog, private auth: AuthService, private router: Router, private _snackBar: MatSnackBar) {

    effect(() => {
      console.log("Just a check...")
    })
  }
  loggedIn = this.auth.getLoggedInSignal();


  ngOnInit(): void {
    let email = this.auth.getUserEmail();
    if (email) {
      console.log(email)
      this.auth.validateStoredTokens(email).subscribe(response => {
        console.log(response)

        if (!response.successfull) {
          this.logout();
        }
      });
    }
  }

  openSignDiaglog() { //change the name of this function
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      disableClose: true
    })

    dialogRef.backdropClick().subscribe(() => {
      console.log("Backdrop click")

      if (dialogRef.componentInstance.hasValue) {
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

    dialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        console.log(event)

        if (dialogRef.componentInstance.hasValue) {
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
        console.log(res)
        if (res.toClose) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  logout() {
    this.auth.logout().subscribe(response => {
      if (response.successfull) {
        console.log("deleting user info from local storage")
        localStorage.removeItem("userInfo")
        localStorage.removeItem("recipes")

        this.router.navigate(['/'])
      }
      else {
        console.log("Failed?!")
        this._snackBar.open("Logout failed", "", {
          duration: 1500
        })
      }
    })
  }

  openFavorites() {
    this.router.navigate(['favorites'])
  }
}
