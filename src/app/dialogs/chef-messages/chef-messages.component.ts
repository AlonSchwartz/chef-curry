import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'chef-messages',
  templateUrl: './chef-messages.component.html',
  styleUrls: ['./chef-messages.component.scss']
})
export class ChefMessagesComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ChefMessagesComponent>) { }

  popupType = "";
  dontShowAgain: boolean = false;

  ngOnInit() {
    this.popupType = this.data.type;
  }

  /**
   * Closes the popup
   */
  closePopup() {
    this.dialogRef.close({ 'dontShowAgain': this.dontShowAgain })
  }

  /**
   * Sets a redirection setting to a different path
   * @param path the path to redirect to
   */
  redirectTo(path: string) {
    let hasAccount: boolean = true;
    if (path === 'register') {
      hasAccount = false;
    }
    this.dialogRef.close({ 'hasAccount': hasAccount })
  }

  /**
   * This function is responsible for confirming the closure of the current popup and sending the user's decision (to close or not) back to the original popup.
   * @param toClose A boolean value indicating whether the user has confirmed the closure of the popup
   */
  confirmFormClosure(toClose: boolean) {
    this.dialogRef.close({ 'toClose': toClose });
  }
}