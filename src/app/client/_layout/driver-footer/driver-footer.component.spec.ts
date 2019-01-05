import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverFooterComponent } from './driver-footer.component';

describe('DriverFooterComponent', () => {
  let component: DriverFooterComponent;
  let fixture: ComponentFixture<DriverFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
