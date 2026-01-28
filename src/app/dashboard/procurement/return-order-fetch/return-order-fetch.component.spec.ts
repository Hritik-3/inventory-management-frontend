import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnOrderFetchComponent } from './return-order-fetch.component';

describe('ReturnOrderFetchComponent', () => {
  let component: ReturnOrderFetchComponent;
  let fixture: ComponentFixture<ReturnOrderFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnOrderFetchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReturnOrderFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
