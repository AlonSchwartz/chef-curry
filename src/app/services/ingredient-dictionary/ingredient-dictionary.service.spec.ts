import { TestBed } from '@angular/core/testing';

import { IngredientDictionaryService } from './ingredient-dictionary.service';

describe('IngredientDictionaryService', () => {
  let service: IngredientDictionaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientDictionaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
