import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterializeAutocompleteComponent } from './materialize-autocomplete.component';

describe('InsuranceCompanyComponent', () => {
  let component: MaterializeAutocompleteComponent;
  let fixture: ComponentFixture<MaterializeAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterializeAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterializeAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
