import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletKeyModalComponent } from './wallet-key-modal.component';

describe('WalletKeyModalComponent', () => {
  let component: WalletKeyModalComponent;
  let fixture: ComponentFixture<WalletKeyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletKeyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletKeyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
