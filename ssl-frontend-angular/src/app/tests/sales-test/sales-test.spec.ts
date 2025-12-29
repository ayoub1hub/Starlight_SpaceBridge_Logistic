import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTest } from './sales-test';

describe('SalesTest', () => {
  let component: SalesTest;
  let fixture: ComponentFixture<SalesTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesTest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
