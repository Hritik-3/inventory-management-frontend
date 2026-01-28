import { TestBed } from '@angular/core/testing';

import { SupplierRatingService } from './supplier-rating.service';

describe('SupplierRatingService', () => {
  let service: SupplierRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
