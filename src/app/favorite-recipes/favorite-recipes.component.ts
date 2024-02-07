import { Component, ViewChild } from '@angular/core';
import { Recipe } from '../interfaces/recipe.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'favorites',
  templateUrl: './favorite-recipes.component.html',
  styleUrls: ['./favorite-recipes.component.scss']
})
export class FavoriteRecipesComponent {
  recipes: Recipe[] = [];
  displayedColumns: string[] = ['name', 'date', 'description'];
  displayedColumns2: string[] = ['respFavorites'];

  dataSource = new MatTableDataSource<Recipe>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //isPortrait: boolean = false;


  constructor(private router: Router) {
  }
  ngOnInit() {
    let recipesJSON = localStorage.getItem("recipes")
    if (recipesJSON) {
      this.recipes = JSON.parse(recipesJSON)
    }

    console.log(this.recipes)
    console.log("======  ")
    this.dataSource = new MatTableDataSource<Recipe>(this.recipes);
    console.log(this.recipes)

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

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