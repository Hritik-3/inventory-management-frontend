import { TestBed } from '@angular/core/testing';

import { ReturnOrderFetchService } from './return-order-fetch.service';

describe('ReturnOrderFetchService', () => {
  let service: ReturnOrderFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnOrderFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
