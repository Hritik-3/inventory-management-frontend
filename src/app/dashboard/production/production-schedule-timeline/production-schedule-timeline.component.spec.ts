import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionScheduleTimelineComponent } from './production-schedule-timeline.component';

describe('ProductionScheduleTimelineComponent', () => {
  let component: ProductionScheduleTimelineComponent;
  let fixture: ComponentFixture<ProductionScheduleTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionScheduleTimelineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductionScheduleTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
