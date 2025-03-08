import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeBridgeDepositComponent } from './de-bridge-deposit.component';

describe('DeBridgeDepositComponent', () => {
  let component: DeBridgeDepositComponent;
  let fixture: ComponentFixture<DeBridgeDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeBridgeDepositComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeBridgeDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
