import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IngredientDictionaryService } from '../services/ingredient-dictionary/ingredient-dictionary.service';
import { RecipeMakerService } from '../services/recipe/recipeMaker.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NotFoundComponent } from '../not-found/not-found.component';
import { ChefMessagesComponent } from '../dialogs/chef-messages/chef-messages.component';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss'],

})
export class RecipeFormComponent {
  items: string[] = [];

  userInput = '';
  selectedItems: any[] = [];
  filteredItems!: Observable<any[]>;
  filteredItems2: string[] = [];
  isCreating: boolean = false;
  loggedIn = this.auth.loggedInSignal;
  dontShowAgain: boolean = false;

  form: FormGroup; // Create a form group

  constructor(private formBuilder: FormBuilder,
    private dictionary: IngredientDictionaryService,
    private recipeMaker: RecipeMakerService,
    private router: Router,
    public dialog: MatDialog,
    private auth: AuthService) {
    this.form = this.formBuilder.group({
      withAdditionalIngredients: [true],
      userInput: new FormControl(''), // Use a FormControl for the userInput
      //selectedItems: [[]] // Initialize selectedItems as an empty array
    });

    // dictionary.test();
  }
  ngOnInit() {
    // Initialize the userInput form control
    this.filteredItems = this.form.controls['userInput'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterItems(value as string))
    );

    //Getting user display settings from local storage
    let userDisplaySetting = localStorage.getItem('dontShowAgain')
    if (userDisplaySetting) {
      this.dontShowAgain = JSON.parse(userDisplaySetting);
    }

    // suggest the user to login, only if he is not logged and he did not asked to hide this message
    if (!this.loggedIn() && !this.dontShowAgain) {
      this.openPopup('suggest-login');
    }

  }

  private _filterItems(value: string): any[] {
    if (value.length == 0) {
      return [];
    }
    if (value.length == 1) {
      this.items = this.dictionary.onInputChange(value)

    }
    this.items = this.dictionary.onInputChange(value)

    const filterValue = value.toLowerCase();

    // Simulate lazy loading here based on the filterValue
    return this.items.filter(item => item.toLowerCase().includes(filterValue));
  }

  onInputChanged() {
    // Simulate lazy loading here based on this.userInput
    const inputValue = this.form.controls['userInput'].value;
    if (inputValue === '') {
      // If the input is empty, don't show any options
      this.filteredItems = new Observable<any[]>(observer => {
        observer.next([]);
      });
    }
    else {
      this.filteredItems = new Observable<string[]>(observer => {
        observer.next(this._filterItems(this.form.controls['userInput'].value));
      });
    }
  }


  addSelectedItem(item: string) {
    if (!this.selectedItems.includes(item)) {
      this.selectedItems.push(item);
      this.userInput = '';
      console.log("User input reset")
    }
    else {
      console.log("Already selected.")
      this.userInput = '';
      console.log(this.userInput)
    }
    this.form.controls['userInput'].setValue('');
  }

  removeSelectedItem(item: any) {
    console.log(item)
    const index = this.selectedItems.indexOf(item);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
      //  this.form.controls['userInput'].reset();  //will reset all the selections
      console.log(this.form.controls['userInput'])
    }
  }

  submitForm() {
    this.isCreating = true;
    let withAdditionalIngredients = this.form.get('withAdditionalIngredients')?.value;

    const recipeReq = {
      "withAdditionalIngredients": withAdditionalIngredients,
      "items": this.selectedItems
    }

    const startTime = performance.now();

    this.recipeMaker.createRecipe(recipeReq).subscribe((res: Object) => {
      this.isCreating = false;
      if (res) {
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
        console.log(`Elapsed time: ${elapsedTime} ms`);

        this.router.navigate(['viewRecipe'])
      }
      else {

        const dialogRef = this.dialog.open(NotFoundComponent, {
          //   width: "35vh",
          //  height: "58vh"
        })
        //TODO: Add error handling here. what to do when it fails?
      }

    })
    //  this.router.navigate(['viewRecipe'], { state: { recipe: res } })

    // console.log(recipeReq)
  }


  //////////////////////////////////////////////
  removeItem(item: any) {
    const index = this.selectedItems.indexOf(item);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
    }
  }

  printItems() {
    console.log(this.selectedItems)
    let e = {
      "a": "first parameter",
      "b": [["some data", "more data"], ["second array", "with more info"]],
      "c": "some text that doesnt mean anything, its just for the check",
      "d": "i will do copy and paste to this text, in order to make it really long. i will do copy and paste to this text, in order to make it really long. i will do copy and paste to this text, in order to make it really long. i will do copy and paste to this text, in order to make it really long. i will do copy and paste to this text, in order to make it really long. i will do copy and paste to this text, in order to make it really long. i will do copy and paste to this text, in order to make it really long. i will do copy and paste to this text, in order to make it really long. i will do copy and paste to this text, in order to make it really long. i will do copy and paste to this text, in order to make it really long. i will do copy and paste to this text, in order to make it really long. i will do copy and paste to this text, in order to make it really long. i will do copy and paste to this text, in order to make it really long. i will do copy and paste to this text, in order to make it really long. i will do copy and paste to this text, in order to make it really long. "
    }
    this.router.navigate(['viewRecipe', { state: e }])
  }

  urlcheck() {
    this.recipeMaker.test().subscribe(a => {
      console.log(a)
    })
  }

  openPopup(popupType: string) {
    const dialogRef = this.dialog.open(ChefMessagesComponent, {
      //width: "40vh",
      //height: "25vh",
      data: {
        type: popupType,
      },
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.dontShowAgain) {
          this.dontShowAgain = true;
          localStorage.setItem('dontShowAgain', JSON.stringify(this.dontShowAgain))
        };

        if (result.hasAccount != undefined) {
          const loginDialog = this.dialog.open(LoginDialogComponent, {
            width: "35vh",
            height: "58vh",
            data: {
              hasAccount: result.hasAccount
            }
          })
        }
      }
    })
  }

}
/*
Hi! This is your chef speaking.
I have noticed that you don't have an account yet.
That means that you cannot save the recipe I am about to give you.
Would you like to create an account now?

create account | maybe later
*/