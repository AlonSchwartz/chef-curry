import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Recipe } from '../../interfaces/recipe.interface';
import { recipe1, recipe2, recipe3 } from 'src/assets/recipes/exampleRecipes';
//import { environment } from 'src/environments/environment.development';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeMakerService {

  constructor(private http: HttpClient) {
    let stringRecipes = localStorage.getItem("recipes")
    if (stringRecipes) {
      this.favorites = JSON.parse(stringRecipes)
      console.log(this.favorites)
    }
  }
  private serverAddress = environment.serverAddress;

  // private serverAddress: string = "http://localhost:9001";
  // private serverAddress: string = "https://chef-curry-backend.vercel.app";
  // private serverAddress: string = "https://chef-curry-backend.onrender.com"

  recipe: Recipe | undefined;
  favorites: Recipe[] = [];

  createRecipe(recipeReq: object) {
    console.log(this.serverAddress)
    console.log(recipeReq)

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };

    return this.http.post(this.serverAddress + '/api/recipes/', recipeReq, httpOptions).pipe(
      map((res: any) => {
        // console.log(res)
        return res as Recipe
      }),
      tap(res => {
        //res.date = new Date().toLocaleDateString()
        console.log(res)
        this.recipe = res;
        console.log(typeof this.recipe.id)

      }),
      catchError(this.handleError<any>('create recipe')
      ))
  }

  /**
   * gets a recipe from memory. used to get the recipe in the recipe page after creating a new recipe.
   * @returns recipe object
   */
  getRecipe() {
    return this.recipe;
  }

  getRecipeByHash(hash: string) {

    //In case the user tries to enter an example recipe by url
    if (hash.includes('example')) {
      console.log("Getting example Recipe.")
      let id = hash.charAt(hash.length - 1)
      this.recipe = this.getExampleRecipes(Number(id))
      if (this.recipe) {
        return of(this.recipe)
      }
    }

    console.log("trying this hash: " + hash)
    return this.http.get(this.serverAddress + '/api/recipes/' + hash).pipe(
      map((res: any) => {
        return res.recipe as Recipe
      }),
    )
  }

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

    //In case the ID is not existed.
    return undefined;
  }

  saveRecipe(recipe: Recipe) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };

    let email = '';
    let localData = localStorage.getItem("userInfo")
    if (localData) {
      email = JSON.parse(localData).email;
    }
    console.log(email)
    const userData = {
      email: email,
      recipeId: recipe.id
    }
    return this.http.post(this.serverAddress + '/api/recipes/save', userData, httpOptions).pipe(
      tap(res => {
        console.log(res)
        this.favorites.push(recipe)
        localStorage.setItem("recipes", JSON.stringify(this.favorites))
      }),
      catchError(this.handleError<any>('favorite'))
    )



    /*
    subscribe(res => {
      console.log(res)
      this.favorites.push(recipe)
      localStorage.setItem("recipes", JSON.stringify(this.favorites))
    }, (error) => {
      //create a message to notify the user that saving have failed.
      console.log("Got an error.")
    })
*/
    // JUST FOR THE TEST AND NEED TO BE DELETED:
    // this.favorites.push(recipe)
    //this.favorites.push(recipe)
    //this.favorites.push(recipe)
    ///this.favorites.push(recipe)
    //this.favorites.push(recipe)

    //localStorage.setItem("recipes", JSON.stringify(this.favorites))
    ///
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
      // console.log(error)
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.error(`${operation} failed.`);
      console.log(error)
      console.log(result)
      // console.log(error.error.message)
      let msg = null
      // Let the app keep running by returning an empty result.
      return of(msg as T);
    };
  }

  test() {
    return this.http.get(this.serverAddress + '/api/recipes/urlCheck')
  }

  shareRecipe() {
    const userData = {
      recipeId: 15
    }
    return this.http.post(this.serverAddress + '/api/recipes/share', userData)
  }

  checkIfFavorite(recipeId: number) {
    if (this.favorites.length > 0) {
      return this.favorites.some(recipe => recipe.id = recipeId)
    }

    else {
      return false;
    }
  }
}
