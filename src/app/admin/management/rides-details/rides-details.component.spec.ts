import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RidesDetailsComponent } from './rides-details.component';

describe('RidesDetailsComponent', () => {
  let component: RidesDetailsComponent;
  let fixture: ComponentFixture<RidesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RidesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RidesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
