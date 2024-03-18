import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'recipe-examples',
  templateUrl: './recipe-examples.component.html',
  styleUrls: ['./recipe-examples.component.scss']
})
export class RecipeExamplesComponent {

  constructor(private router: Router) { }

  viewRecipe(exampleRecipeId: number) {
    const navigationExtras = {
      state: {
        recipeId: exampleRecipeId
      }
    };
    this.router.navigate(['viewRecipe'], navigationExtras);

  }

}
