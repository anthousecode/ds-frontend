import { TestBed } from '@angular/core/testing';

import { PatientSearchService } from './patient-search.service';

describe('PatientSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PatientSearchService = TestBed.get(PatientSearchService);
    expect(service).toBeTruthy();
  });
});
