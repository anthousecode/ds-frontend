import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientUnionModalComponent } from './patient-union-modal.component';

describe('PatientUnionModalComponent', () => {
  let component: PatientUnionModalComponent;
  let fixture: ComponentFixture<PatientUnionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientUnionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientUnionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
