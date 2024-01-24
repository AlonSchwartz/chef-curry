import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-share-menu',
  templateUrl: './share-menu.component.html',
  styleUrls: ['./share-menu.component.scss']
})
export class ShareMenuComponent {

  constructor(private _bottomSheetRef: MatBottomSheetRef<ShareMenuComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private _snackBar: MatSnackBar) { }

  whatsappLink = 'https://web.whatsapp.com/send?text='; // Base URL
  dynamicText = '!'; // Text to append 

  ngOnInit() {
    console.log(this.data)
    this.dynamicText = this.data.url;
  }

  openLink(withSnackbar?: boolean): void {
    // console.log(event)
    if (withSnackbar) {
      this._snackBar.open("Recipe URL copied to your clipboard. Enjoy!", "", {
        duration: 3000,
      },
      )
    }
    this._bottomSheetRef.dismiss();
    // event.preventDefault();
    console.log(this.data)
  }

  generateMailtoLink(): string {
    const subject = 'Recipe from Chef Curry';
    const body = 'Check out this recipe, i think you will like it: \r\n' + this.data.url;
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
  }

  open() {
    this._snackBar.open("Copied to clipboard");
    this._bottomSheetRef.dismiss();

  }

}
