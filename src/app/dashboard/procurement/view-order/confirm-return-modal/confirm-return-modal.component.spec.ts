import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmReturnModalComponent } from './confirm-return-modal.component';

describe('ConfirmReturnModalComponent', () => {
  let component: ConfirmReturnModalComponent;
  let fixture: ComponentFixture<ConfirmReturnModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmReturnModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmReturnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
