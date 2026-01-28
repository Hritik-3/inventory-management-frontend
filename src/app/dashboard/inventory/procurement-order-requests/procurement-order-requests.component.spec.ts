import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementOrderRequestsComponent } from './procurement-order-requests.component';

describe('ProcurementOrderRequestsComponent', () => {
  let component: ProcurementOrderRequestsComponent;
  let fixture: ComponentFixture<ProcurementOrderRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcurementOrderRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProcurementOrderRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
