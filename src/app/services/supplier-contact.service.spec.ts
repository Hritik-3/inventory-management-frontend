import { TestBed } from '@angular/core/testing';

import { SupplierContactService } from './supplier-contact.service';

describe('SupplierContactService', () => {
  let service: SupplierContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
