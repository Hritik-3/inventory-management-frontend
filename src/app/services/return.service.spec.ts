import { TestBed } from '@angular/core/testing';

import { ReturnOrderService } from './return.service';

describe('ReturnService', () => {
  let service: ReturnOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
