import { Component, effect } from '@angular/core';
import { RecipeMakerService } from '../services/recipe/recipeMaker.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareMenuComponent } from '../dialogs/share-menu/share-menu.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent {

  someData: string | null = '';
  recipe;
  isFavorite: boolean = false;
  loggedIn = this.auth.loggedInSignal;
  fav_title: string = "";
  isLoading: boolean = true;

  scrollToTop() {
    console.log("Scrolling to top!")
    window.scrollTo(0, 0);
  }

  ngOnInit() {
    if (window.scrollY > 0) {
      this.scrollToTop();
    }
    // this.loading = true;
    //In order to load an example recipe from assets
    this.route.queryParams.subscribe(() => {
      const recipeId = history.state.recipeId;
      const recipe = history.state.recipe;
      if (recipeId) {
        this.recipe = this.recipeMaker.getExampleRecipes(recipeId)
        this.isLoading = false;
      }
      if (recipe) {
        console.log("There is a recipe from history")
        this.recipe = recipe;
        this.isFavorite = true;
        this.isLoading = false;
      }
    });

    //In order to load a recipe by url
    this.route.params.subscribe(params => {
      const paramId = params['id']
      if (paramId) {
        this.recipeMaker.getRecipeByHash(paramId).subscribe(res => {
          this.isLoading = false;
          console.log("It works?!?!")
          console.log(res)
          if (res) {
            this.recipe = res;
            this.isFavorite = this.recipeMaker.checkIfFavorite(this.recipe.id)
          }
        })
      }
    })
  }
  constructor(
    private recipeMaker: RecipeMakerService, private route: ActivatedRoute,
    private location: Location, private auth: AuthService,
    private _bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar) {

    let recipe = this.recipeMaker.getRecipe()
    this.recipe = recipe;

    if (this.recipe) {
      this.isLoading = false;
    }

    effect(() => {
      console.log("IN RECIPE: signal value changed, and its now: ")
      console.log(this.loggedIn())


      if (this.loggedIn()) {
        this.fav_title = "Add to Favorites"
      } else {
        this.fav_title = "You have to be logged in"
      }
    })
  }

  addToFavorites() {
    if (this.isFavorite)
      return;
    else if (!this.loggedIn()) {
      this._snackBar.open("You have to be logged in", "", {
        duration: 1500
      },
      )
      return;
    }

    console.log(this.recipe)
    if (this.recipe) {
      this.recipeMaker.saveRecipe(this.recipe).subscribe(res => {
        console.log("hello")
        if (res) {
          console.log(res)
        }
        else {
          //create a message to notify the user that saving have failed.
          console.log("Got an error.")
        }
      })
      this.isFavorite = true;
    }
    console.log(this.recipeMaker.favorites)
  }


  get currentUrl(): string {
    return this.location.path();
  }
  shareRecipe(text: string) {

    console.log(this.recipe)
    const link = 'localhost:4200/viewRecipe/' + this.recipe?.shareableHash; // change to website domain


    this._bottomSheet.open(ShareMenuComponent, {
      data: { url: link }
    });

  }

  private buildShareText(): string {
    // Customize this method based on how you want to construct the text for sharing
    const recipe = this.recipe;
    if (recipe)
      return `*${recipe.name}*\r\nIngredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.instructions.join('\n')}\n\nDescription:\n${recipe.description}`;
    else
      return 'None found'
  }

  test() {
    console.log(this.recipeMaker.favorites)
  }
}
