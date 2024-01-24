import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'recipe-examples',
  templateUrl: './recipe-examples.component.html',
  styleUrls: ['./recipe-examples.component.scss']
})
export class RecipeExamplesComponent {

  constructor(private router: Router) { }

  viewRecipe(exampleRecipe: number) {
    //this.router.navigate(['viewRecipe'], { skipLocationChange: true })
    //this.router.navigate(['viewRecipe'], { queryParams: { recipeId: exampleRecipe }, skipLocationChange: true });
    const navigationExtras = {
      state: {
        recipeId: exampleRecipe
      }
    };
    this.router.navigate(['viewRecipe'], navigationExtras);

  }

}
