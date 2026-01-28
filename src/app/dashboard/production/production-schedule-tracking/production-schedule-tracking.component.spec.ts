import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionScheduleTrackingComponent } from './production-schedule-tracking.component';

describe('ProductionScheduleTrackingComponent', () => {
  let component: ProductionScheduleTrackingComponent;
  let fixture: ComponentFixture<ProductionScheduleTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionScheduleTrackingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductionScheduleTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
