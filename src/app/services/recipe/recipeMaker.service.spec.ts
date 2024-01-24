import { TestBed } from '@angular/core/testing';

import { RecipeMakerService } from './recipeMaker.service';

describe('DataService', () => {
  let service: RecipeMakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeMakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
