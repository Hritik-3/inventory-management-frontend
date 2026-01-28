import { TestBed } from '@angular/core/testing';

import { ProductionScheduleService } from './production-schedule.service';

describe('ProductionScheduleService', () => {
  let service: ProductionScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
