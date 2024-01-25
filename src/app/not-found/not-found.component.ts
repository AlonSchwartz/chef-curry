import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {

  constructor(private route: ActivatedRoute) { }
  errorMessage = "Seems like the dog ate the recipe. Please try again. "

  ngOnInit() {
    //in case we got here from a bad route
    if (this.route.snapshot.data['fromRoute']) {
      this.errorMessage = " It seems we can't find this page. Please try again."
    }


  }
}
