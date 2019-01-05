import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRidehistoryComponent } from './payment-ridehistory.component';

describe('PaymentRidehistoryComponent', () => {
  let component: PaymentRidehistoryComponent;
  let fixture: ComponentFixture<PaymentRidehistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentRidehistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRidehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
