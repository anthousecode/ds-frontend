import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Stage6Component } from './stage6.component';

describe('Stage6Component', () => {
  let component: Stage6Component;
  let fixture: ComponentFixture<Stage6Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Stage6Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Stage6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
