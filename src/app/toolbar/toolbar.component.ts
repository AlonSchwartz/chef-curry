import { Component, OnInit, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  constructor(public dialog: MatDialog, private auth: AuthService, private router: Router) {

    effect(() => {
      console.log("Just a check...")
    })
  }
  //loggedIn: boolean = false;
  loggedIn = this.auth.loggedInSignal;

  openSignDiaglog() { //change the name of this function
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: "35vh",
      height: "58vh"
    })
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

  openFavorites() {
    this.router.navigate(['favorites'])
  }
}
