import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PatientCardComponent} from './patient-card.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('PatientCardComponent', () => {
  let component: PatientCardComponent;
  let fixture: ComponentFixture<PatientCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [PatientCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be valid', () => {
    expect(component.patientForm.valid).toBeTruthy();
  });

  it('should be valid', () => {
    expect(component.patientForm.valid).toBeFalsy();
    component.patientForm.controls.name.setValue('data');
    component.patientForm.controls.snlins.setValue('');
  });
});
