import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecipeExamplesComponent } from './recipe-examples/recipe-examples.component';

import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { RecipeComponent } from './recipe/recipe.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule here
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import { LoginDialogComponent } from './dialogs/login-dialog/login-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotFoundComponent } from './not-found/not-found.component';
import { FavoriteRecipesComponent } from './favorite-recipes/favorite-recipes.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { ChefMessagesComponent } from './dialogs/chef-messages/chef-messages.component';
import { ShareMenuComponent } from './dialogs/share-menu/share-menu.component';
import { MatListModule } from '@angular/material/list';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    RecipeExamplesComponent,
    ToolbarComponent,
    RecipeComponent,
    RecipeFormComponent,
    LoginDialogComponent,
    NotFoundComponent,
    FavoriteRecipesComponent,
    ChefMessagesComponent,
    ShareMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatListModule,
    MatBottomSheetModule,
    ClipboardModule,
    MatSnackBarModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
