import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeExamplesComponent } from './recipe-examples.component';

describe('RecipeExamplesComponent', () => {
  let component: RecipeExamplesComponent;
  let fixture: ComponentFixture<RecipeExamplesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeExamplesComponent]
    });
    fixture = TestBed.createComponent(RecipeExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
