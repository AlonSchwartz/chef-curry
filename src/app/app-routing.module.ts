import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeComponent } from './recipe/recipe.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { FavoriteRecipesComponent } from './favorite-recipes/favorite-recipes.component';
import { authGuard } from './services/auth/guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: 'viewRecipe', component: RecipeComponent },
  { path: 'viewRecipe/:id', component: RecipeComponent },
  { path: '', component: HomepageComponent },
  { path: 'form', component: RecipeFormComponent },
  { path: 'favorites', component: FavoriteRecipesComponent, canActivate: [authGuard] },
  {
    path: '**', component: NotFoundComponent, data: {
      "fromRoute": true
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
