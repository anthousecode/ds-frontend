import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDeleteModalComponent } from './patient-delete-modal.component';

describe('PatientDeleteModalComponent', () => {
  let component: PatientDeleteModalComponent;
  let fixture: ComponentFixture<PatientDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
