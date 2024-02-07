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
    const navigationExtras = {
      state: {
        recipeId: exampleRecipe
      }
    };
    this.router.navigate(['viewRecipe'], navigationExtras);

  }

}
