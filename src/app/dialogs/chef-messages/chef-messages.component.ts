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

  closePopup() {
    this.dialogRef.close({ 'dontShowAgain': this.dontShowAgain })
  }

  redirectTo(path: string) {
    let hasAccount: boolean = true;
    if (path === 'register') {
      hasAccount = false;
    }
    this.dialogRef.close({ 'hasAccount': hasAccount })
  }
}
