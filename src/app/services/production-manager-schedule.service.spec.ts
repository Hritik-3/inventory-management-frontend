import { TestBed } from '@angular/core/testing';

import { ProductionManagerScheduleService } from './production-manager-schedule.service';

describe('ProductionManagerScheduleService', () => {
  let service: ProductionManagerScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionManagerScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
