import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'recipe-examples',
  templateUrl: './recipe-examples.component.html',
  styleUrls: ['./recipe-examples.component.scss']
})
export class RecipeExamplesComponent {

  constructor(private router: Router) { }

  /**
   * Navigates to example recipe by it's ID
   * @param exampleRecipeId the id of the recipe
   */
  navigateToRecipe_byId(exampleRecipeId: number) {
    const navigationExtras = {
      state: {
        recipeId: exampleRecipeId
      }
    };
    this.router.navigate(['viewRecipe'], navigationExtras);
  }

}
