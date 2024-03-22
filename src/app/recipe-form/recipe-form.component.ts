import { Component, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IngredientService } from '../services/ingredient/ingredient.service';
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
export class RecipeFormComponent implements AfterViewInit {
  @ViewChild('userInputDiv')
  inputDiv!: ElementRef;

  @ViewChild('mainHeader')
  mainHeader!: ElementRef;

  items: string[] = [];

  filteredItems!: Observable<any[]>;
  isCreating: boolean = false;
  loggedIn = this.auth.getLoggedInSignal();
  dontShowAgain: boolean = false;
  isPopupOpen: boolean = false;
  mobileKeyboardOpen: boolean = false;
  previousTag: string | null = null;
  inputHeight: string = '375px'
  form: FormGroup;
  warningDisplayed: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private dictionary: IngredientService,
    private recipeMaker: RecipeMakerService,
    private router: Router,
    public dialog: MatDialog,
    private auth: AuthService) {
    this.form = this.formBuilder.group({
      withAdditionalIngredients: [true],
      userInput: new FormControl(''),
      selectedItems: new FormControl<string[]>([], Validators.required)
    });

  }

  /**
   * Checks if the users is using a mobile phone
   * @returns boolean that indicates the answer
   */
  checkIfMobile(): boolean {
    var isMobile = false;
    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
      isMobile = true;
    }
    return isMobile;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.adjustBackgroundHeight(); // We are calling this to make sure that the design will fit the screen size on loading
    }, 15); // really small timeout, so all the divs will load properly
  }

  /**
   * Creates a space for keyboard in mobile devices and scrolling down, in order to have better view on the ingredients list.
   * Without this function, the ingredients list will be hidden by the keyboard on some devices.
   */
  showKeyboardSpacer() {
    if (this.checkIfMobile()) {
      if (this.mobileKeyboardOpen) {
        return;
      }

      this.mobileKeyboardOpen = true;
      const headerPosition = this.mainHeader.nativeElement.offsetTop;

      // Schedule scroll operation to happen just before the next repaint for a smoother scrolling experience.
      requestAnimationFrame(() => {
        window.scrollTo(0, headerPosition);
      });
    }
  }

  ngOnInit() {

    if (window.scrollY > 0) {
      this.scrollToTop();
    }

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

  /**
   * Adjusting background image height to be from the top of the page, to the exact spot in every device screen.
   * The desired spot is inside a different div.
   */
  @HostListener('window:resize', ['$event'])
  adjustBackgroundHeight() {

    if (this.inputDiv) {
      const newInputHeight = this.inputDiv.nativeElement.offsetTop + "px"

      if (newInputHeight !== this.inputHeight) {
        console.log(newInputHeight)
        console.log(this.inputHeight)
        this.inputHeight = newInputHeight;
      }
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

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  onInputChanged() {
    // Simulate lazy loading here based on this.userInput
    const inputValue = this.form.controls['userInput'].value;

    if (inputValue === '') {
      this.showKeyboardSpacer();
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
    const selectedItemsControl = this.form.get('selectedItems');
    if (selectedItemsControl) {
      if (!selectedItemsControl.value.includes(item)) {
        selectedItemsControl.setValue([...selectedItemsControl.value, item]);
      } else {
        console.log("Already selected.")
      }
    }

    this.form.controls['userInput'].setValue('');
  }

  removeSelectedItem(item: string) {
    const selectedItemsControl = this.form.get('selectedItems');
    if (selectedItemsControl) {
      selectedItemsControl.setValue(
        selectedItemsControl.value.filter((selectedItem: string) => selectedItem !== item)
      );
    }
  }

  submitForm() {
    this.isCreating = true;
    let withAdditionalIngredients = this.form.get('withAdditionalIngredients')?.value;
    const ingredients = this.form.get('selectedItems')?.value

    const recipeReq = {
      "withAdditionalIngredients": withAdditionalIngredients,
      "ingredients": ingredients
    }

    const startTime = performance.now();

    this.recipeMaker.createRecipe(recipeReq).subscribe((res: Object) => {
      this.isCreating = false;
      if (res) {
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
        console.warn(`Elapsed time: ${elapsedTime} ms`);

        this.router.navigate(['viewRecipe'])
      }
      else {
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
        console.warn(`Elapsed time: ${elapsedTime} ms`);

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



  openPopup(popupType: string) {
    console.log("Opening popup! type is " + popupType)
    if (popupType === 'ingredients-warn' && this.warningDisplayed) {
      return;
    }
    const dialogRef = this.dialog.open(ChefMessagesComponent, {
      data: {
        type: popupType,
      },
      autoFocus: false,
      disableClose: true
    })

    dialogRef.afterOpened().subscribe(() => {

      this.isPopupOpen = true;

    })

    dialogRef.afterClosed().subscribe(result => {
      this.isPopupOpen = false;
      if (result) {
        if (result.dontShowAgain) {
          this.dontShowAgain = true;
          localStorage.setItem('dontShowAgain', JSON.stringify(this.dontShowAgain))
        };

        if (result.hasAccount != undefined) {
          const loginDialog = this.dialog.open(LoginDialogComponent, {
            //width: "35vh",
            //  height: "58vh",
            data: {
              hasAccount: result.hasAccount
            }
          })
        }
      }
      // the only way to close the popup without a result, is from the ingredients warning. 
      else {
        this.warningDisplayed = true;
      }
    })

  }

  /**
 * Handles touch click while the input field is focused.
 * In theory, Focusout can do that - but it triggers also when the user selects and item from the ingredients list, so here we bypass it
 */
  @HostListener('document:click', ['$event'])
  handleTouchClick(event: MouseEvent) {
    if (this.mobileKeyboardOpen == false) {
      return;
    }
    else if ('ontouchstart' in window || navigator.maxTouchPoints) {
      const clickedElement = event.target as HTMLElement;
      //In case the user clicked ouside the ingredients list
      if (clickedElement.tagName !== 'INPUT' && clickedElement.tagName !== 'MAT-LABEL' && clickedElement.tagName !== 'MAT-OPTION' && clickedElement.tagName !== 'SPAN') {
        this.mobileKeyboardOpen = false;
      }
    }
  }

}

