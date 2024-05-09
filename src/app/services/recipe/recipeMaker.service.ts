import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Recipe } from '../../interfaces/recipe.interface';
import { recipe1, recipe2, recipe3 } from 'src/assets/recipes/exampleRecipes';
import { environment } from 'src/environments/environment';
import { UserDataService } from '../user-data/user-data.service';

/**
 * Service that handles recipes creation and retrieval
 */
@Injectable({
  providedIn: 'root'
})
export class RecipeMakerService {

  constructor(private http: HttpClient, private userData: UserDataService) { }
  private serverAddress = environment.serverAddress;

  recipe: Recipe | undefined;
  favorites = this.userData.getFavoriteRecipes()

  /**
   * Sends a request to the server in order to create a recipe
   * @param recipeRequest the recipe request
   * @returns an Observable that contains the recipe
   */
  createRecipe(recipeRequest: object) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };

    return this.http.post(this.serverAddress + '/api/recipes/', recipeRequest, httpOptions).pipe(
      map((res: any) => {
        return res as Recipe
      }),
      tap(res => {
        this.recipe = res;
      }),
      catchError(this.handleError<any>('create recipe')
      ))
  }

  /**
   * Gets a recipe from memory. used to get the recipe in the recipe page after creating a new recipe.
   * @returns recipe object
   */
  getRecipe() {
    return this.recipe;
  }

  /**
   * Gets a recipe by it's hash 
   * @param hash the hash of the recipe
   * @returns an Observable that contains the recipe
   */
  getRecipeByHash(hash: string) {

    //In case the user tries to enter an example recipe by url
    if (hash.includes('example')) {
      let id = hash.charAt(hash.length - 1)
      this.recipe = this.getExampleRecipes(Number(id))
      if (this.recipe) {
        return of(this.recipe)
      }
    }

    return this.http.get(this.serverAddress + '/api/recipes/' + hash).pipe(
      map((res: any) => {
        return res.recipe as Recipe
      }),
    )
  }

  /**
   * Get an example recipe
   * @param recipeId the id of the example recipe
   * @returns the recipe itself
   */
  getExampleRecipes(recipeId: number): Recipe | undefined {
    if (recipeId === 1) {
      return recipe1
    }
    if (recipeId === 2) {
      return recipe2
    }
    if (recipeId === 3) {
      return recipe3
    }

    //In case that the ID does not exist
    return undefined;
  }

  /**
   * Adds the specified recipe to the user's favorites and saves the updated favorites locally.
   * 
   * @param recipe The recipe to be added to favorites.
   * @returns An Observable of the HTTP POST request to save the recipe in favorites.
   */
  addToFavorites(recipe: Recipe) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };

    let email = this.userData.getUserEmail();

    const userData = {
      email: email,
      recipeId: recipe.id
    }

    return this.http.post(this.serverAddress + '/api/recipes/save', userData, httpOptions).pipe(
      tap(res => {
        this.userData.updateFavoriteRecipes(recipe)
      }),
      catchError(this.handleError<any>('favorite'))
    )
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * The http.post should return an observable, so we make sure it will return one.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(`${operation} failed.`);
      console.log(error)

      let message = ''
      if (error.error.message) {
        console.log(error.error.message)
        message = error.error.message;
      }
      else {
        message = "Communication error.";
      }

      // Let the app keep running by returning a result.
      return of(message as T);
    };
  }

  /**
   * Checks if a given recipe is in favorites
   * @param recipeId The id of the recipe to check
   * @returns A boolean indicating whether the recipe is in favorites.
   */
  checkIfFavorite(recipeId: number) {
    if (this.favorites().length > 0) {
      return this.favorites().some(recipe => recipe.id === recipeId)
    }

    else {
      return false;
    }
  }
}
