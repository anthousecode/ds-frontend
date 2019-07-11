import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDocumentModalComponent } from './patient-document-modal.component';

describe('PatientDocumentModalComponent', () => {
  let component: PatientDocumentModalComponent;
  let fixture: ComponentFixture<PatientDocumentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientDocumentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
