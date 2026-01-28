import { TestBed } from '@angular/core/testing';

import { ProcurementDashboardService } from './procurement-dashboard.service';

describe('ProcurementDashboardService', () => {
  let service: ProcurementDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcurementDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
