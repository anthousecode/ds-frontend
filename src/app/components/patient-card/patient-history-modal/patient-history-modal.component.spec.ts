import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHistoryModalComponent } from './patient-history-modal.component';

describe('PatientHistoryModalComponent', () => {
  let component: PatientHistoryModalComponent;
  let fixture: ComponentFixture<PatientHistoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientHistoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
