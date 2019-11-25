import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchChildComponent } from './search-child.component';

describe('SearchChildComponent', () => {
  let component: SearchChildComponent;
  let fixture: ComponentFixture<SearchChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
