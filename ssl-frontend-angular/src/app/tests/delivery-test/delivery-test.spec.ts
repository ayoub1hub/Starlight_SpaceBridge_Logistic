import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryTest } from './delivery-test';

describe('DeliveryTest', () => {
  let component: DeliveryTest;
  let fixture: ComponentFixture<DeliveryTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryTest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
