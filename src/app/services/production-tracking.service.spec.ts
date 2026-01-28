import { TestBed } from '@angular/core/testing';

import { ProductionTrackingService } from './production-tracking.service';

describe('ProductionTrackingService', () => {
  let service: ProductionTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
