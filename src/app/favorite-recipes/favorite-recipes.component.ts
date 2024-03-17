import { Component, ViewChild, effect } from '@angular/core';
import { Recipe } from '../interfaces/recipe.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { UserDataService } from '../services/user-data/user-data.service';


@Component({
  selector: 'favorites',
  templateUrl: './favorite-recipes.component.html',
  styleUrls: ['./favorite-recipes.component.scss']
})
export class FavoriteRecipesComponent {
  recipes = this.userData.getFavoriteRecipes();
  displayedColumns: string[] = ['name', 'date', 'description'];

  dataSource = new MatTableDataSource<Recipe>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private router: Router, private userData: UserDataService) {

    // When the recipes array are getting updated - update the favorite table as well.
    effect(() => {
      this.dataSource = new MatTableDataSource<Recipe>(this.recipes());
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  /**
   * Lifecycle hook that is called after Angular has fully initialized the component's view.
   * Assigns paginator and sort references to the MatTableDataSource for enabling pagination and sorting functionality.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Opens a recipe from favorites
   * @param recipe the recipe to open
   */
  openRecipe(recipe: Recipe) {
    console.log(recipe)
    const navigationExtras = {
      state: {
        recipe: recipe
      }
    };
    this.router.navigate(['viewRecipe'], navigationExtras);
  }
}