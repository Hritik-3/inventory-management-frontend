import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionManagerScheduleComponent } from './production-manager-schedule.component';

describe('ProductionManagerScheduleComponent', () => {
  let component: ProductionManagerScheduleComponent;
  let fixture: ComponentFixture<ProductionManagerScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionManagerScheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductionManagerScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
