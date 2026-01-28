import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementOfficerDashboardComponent } from './procurement-officer-dashboard.component';

describe('ProcurementOfficerDashboardComponent', () => {
  let component: ProcurementOfficerDashboardComponent;
  let fixture: ComponentFixture<ProcurementOfficerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcurementOfficerDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProcurementOfficerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
