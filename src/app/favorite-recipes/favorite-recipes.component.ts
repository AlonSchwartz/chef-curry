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
  //  recipes: Recipe[] = [];
  recipes = this.userData.getFavoriteRecipes();
  displayedColumns: string[] = ['name', 'date', 'description'];
  displayedColumns2: string[] = ['respFavorites'];

  dataSource = new MatTableDataSource<Recipe>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //isPortrait: boolean = false;


  constructor(private router: Router, private userData: UserDataService) {
    effect(() => {
      this.dataSource = new MatTableDataSource<Recipe>(this.recipes());
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
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