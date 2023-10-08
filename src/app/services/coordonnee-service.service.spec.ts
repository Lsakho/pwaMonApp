import { TestBed } from '@angular/core/testing';

import { CoordonneeServiceService } from './coordonnee-service.service';

describe('CoordonneeServiceService', () => {
  let service: CoordonneeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoordonneeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
