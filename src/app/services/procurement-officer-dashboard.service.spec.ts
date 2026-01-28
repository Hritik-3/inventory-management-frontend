import { TestBed } from '@angular/core/testing';
import { ProcurementOfficerDashboardService } from './procurement-officer-dashboard.service';


describe('ProcurementOfficerDashboardService', () => {
  let service: ProcurementOfficerDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcurementOfficerDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
