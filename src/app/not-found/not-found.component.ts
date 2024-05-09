import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {

  constructor(private route: ActivatedRoute, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }
  errorMessage = "Seems like the dog ate the recipe. Please try again. "

  ngOnInit() {
    //in case we got here from a bad route
    if (this.route.snapshot.data['fromRoute']) {
      this.errorMessage = "It seems we can't find this page. Please try again."
    }
    if (this.data?.errorMessage) {
      this.errorMessage = "Seems like " + this.data.errorMessage + " Please try again."
    }


  }
}
