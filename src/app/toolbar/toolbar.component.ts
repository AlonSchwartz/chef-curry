import { Component, OnInit, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { ChefMessagesComponent } from '../dialogs/chef-messages/chef-messages.component';


@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  availableFonts: string[] = ["Roboto", "Segoe UI", "-apple-system", "BlinkMacSystemFont", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "sans-serif"];
  selectedFont: string = '';
  baseFontSizes: number[] = [10, 12, 14, 16, 18, 20];
  selectedBaseFontSize: number = 16;

  constructor(public dialog: MatDialog, private auth: AuthService, private router: Router) {

    effect(() => {
      console.log("Just a check...")
    })
  }
  //loggedIn: boolean = false;
  loggedIn = this.auth.loggedInSignal;


  ngOnInit(): void {
    let userInfo = localStorage.getItem("userInfo");
    console.log(userInfo)
    if (userInfo) {
      let email = JSON.parse(userInfo).email;
      console.log(email)
      this.auth.validateStoredTokens(email).subscribe(response => {
        console.log(response)

        if (!response.successfull) {
          this.logout();
        }
      });
    }
  }

  applyFont(): void {
    document.body.style.fontFamily = this.selectedFont;
  }
  changeBaseFontSize(): void {
    document.documentElement.style.fontSize = this.selectedBaseFontSize + 'px';
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
        window.location.href = '/'
      }
      else {
        console.log("Failed?!")
        // notify the user that the logout failed
      }
    })
  }

  openFavorites() {
    this.router.navigate(['favorites'])
  }
}
