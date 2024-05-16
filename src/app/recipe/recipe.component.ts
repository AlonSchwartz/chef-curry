import { Component, effect } from '@angular/core';
import { RecipeMakerService } from '../services/recipe/recipeMaker.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareMenuComponent } from '../dialogs/share-menu/share-menu.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Recipe } from '../interfaces/recipe.interface';


@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent {

  recipe: Recipe | undefined;
  isFavorite: boolean = false;
  loggedIn = this.auth.getLoggedInSignal();
  fav_title: string = "You have to be logged in";
  isLoading: boolean = true;


  scrollToTop() {
    window.scrollTo(0, 0);
  }

  ngOnInit() {
    if (window.scrollY > 0) {
      this.scrollToTop();
    }

    if (!this.recipe) {
      // If we dont have a recipe at this point, we will not get a recipe and we can stop the loading animation.
      // Setting a timeout in order that the animation will be seen briefly
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }

  }
  constructor(
    private recipeMaker: RecipeMakerService, private route: ActivatedRoute,
    private auth: AuthService, private _bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar) {

    this.loadRecipeByUrl()

    //In case that signal value of loggedIn have been changed
    effect(() => {
      if (this.loggedIn()) {
        if (this.recipe) {
          //In case where the user signed in from the recipe page
          this.isFavorite = this.recipeMaker.checkIfFavorite(this.recipe.id)
        }

        this.changeFavoriteTitle(this.isFavorite)

      }
    })
  }

  /**
   * Loads a recipe based on url
   */
  loadRecipeByUrl() {
    this.route.queryParams.subscribe(() => {

      // If we got here from favorites or homepage, there will be 2 elements in history state
      if (Object.keys(history.state).length > 1) {
        const recipe = history.state.recipe;

        this.isLoading = false;

        if (recipe) {
          this.recipe = recipe;
          this.isFavorite = true;
        }
      }
    });

    //In order to load a recipe by url with hash
    this.route.params.subscribe(params => {

      if (!this.recipe) {
        const paramId = params['id']
        if (paramId) {
          this.recipeMaker.getRecipeByHash(paramId).subscribe(res => {
            this.isLoading = false;
            if (res) {
              this.recipe = res;
              this.isFavorite = this.recipeMaker.checkIfFavorite(this.recipe.id)
              this.changeFavoriteTitle(this.isFavorite)
            }
          })
        }
      }
    })
  }

  /**
   * Changes favorite button title based on boolean parameter
   * @param isFavorite the boolean parameter
   */
  changeFavoriteTitle(isFavorite: boolean) {
    if (isFavorite) {
      this.fav_title = "In Favorites"
    } else {
      this.fav_title = "Add to Favorites"
    }
  }

  /**
   * Adding a recipe to favorites 
   */
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

    if (this.recipe) {
      this.recipeMaker.addToFavorites(this.recipe).subscribe(res => {
        if (res) {
          this.isFavorite = true;
          this.fav_title = "In Favorites"
          this._snackBar.open("Added to favorites!", '', {
            duration: 1500
          })
        }
        else {
          //create a message to notify the user that saving have failed.
          this._snackBar.open("Adding to favorites failed.", '', {
            duration: 2000
          })
        }
      })
    }
  }

  /**
   * Opens share bottom sheet
   */
  shareRecipe() {
    const link = 'https://chef-curry-ai.vercel.app/viewRecipe/' + this.recipe?.shareableHash;

    this._bottomSheet.open(ShareMenuComponent, {
      data: { url: link }
    });
  }
}
