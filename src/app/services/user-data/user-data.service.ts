import { Injectable, signal } from '@angular/core';
import { Recipe } from 'src/app/interfaces/recipe.interface';

/**
 * User data service management, including saving and loading data from local storage
 */
@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  constructor() { }

  private favoriteRecipes = signal<Recipe[]>([])
  private userEmail: string | null = null;

  /**
   * Saves user data in memory and in local storage
   * @param userData Object that contains the user data, in the form of: { recipes: Recipe[], email: string }
   */
  saveUserData(userData: { recipes: Recipe[], email: string }) {
    localStorage.setItem("email", userData.email)
    this.userEmail = userData.email;
    const recipes = userData.recipes;
    if (recipes.length > 0) {
      localStorage.setItem("recipes", JSON.stringify(userData.recipes))
      this.setFavoriteRecipes(recipes)
    }
  }

  /**
   * Deletes user data from local storage
   */
  deleteUserData() {
    localStorage.removeItem("email")
    localStorage.removeItem("recipes")
  }

  /**
   * Sets an array of Recipes as favorite recipes
   * @param recipes the array of recipes
   */
  setFavoriteRecipes(recipes: Recipe[]) {
    this.favoriteRecipes.set(recipes)
  }

  /**
   * Updates the favorite recipes with a new recipe
   * @param recipe the recipe to add
   */
  updateFavoriteRecipes(recipe: Recipe) {
    this.favoriteRecipes.update((currentRecipes) => [...currentRecipes, recipe])
    localStorage.setItem("recipes", JSON.stringify(this.favoriteRecipes()))
  }

  /**
   * Gets the favorite recipes array as Readonly signal 
   */
  getFavoriteRecipes() {
    return this.favoriteRecipes.asReadonly();
  }

  /**
   * Loads favorite recipes from local storage
   */
  loadFavoriteRecipes() {
    let recipesString = localStorage.getItem("recipes")
    if (recipesString) {
      this.setFavoriteRecipes(JSON.parse(recipesString))
    }
  }

  /**
   * Retrieves the user's email address either from the service memory or, if not available, from local storage.
   * @returns The user's email address, or null if not found.
   */
  getUserEmail(): string | null {
    if (this.userEmail) {
      return this.userEmail;
    } else {
      return localStorage.getItem("email");
    }
  }
}
