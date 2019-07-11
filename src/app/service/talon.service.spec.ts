import { TestBed } from '@angular/core/testing';

import { TalonService } from './talon.service';

describe('TalonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TalonService = TestBed.get(TalonService);
    expect(service).toBeTruthy();
  });
});
