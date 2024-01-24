import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefMessagesComponent } from './chef-messages.component';

describe('ChefMessagesComponent', () => {
  let component: ChefMessagesComponent;
  let fixture: ComponentFixture<ChefMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChefMessagesComponent]
    });
    fixture = TestBed.createComponent(ChefMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
