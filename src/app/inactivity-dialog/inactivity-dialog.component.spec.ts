import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactivityDialogComponent } from './inactivity-dialog.component';

describe('InactivityDialogComponent', () => {
  let component: InactivityDialogComponent;
  let fixture: ComponentFixture<InactivityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InactivityDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InactivityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
