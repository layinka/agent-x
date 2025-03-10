import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-wallet-key-modal',
  imports: [],
  templateUrl: './wallet-key-modal.component.html',
  styleUrl: './wallet-key-modal.component.scss'
})
export class WalletKeyModalComponent {
  activeModal = inject(NgbActiveModal);

	@Input() address: string=''; 
  @Input() secretKey: string='0x7864b060e784949fa11403934511654d5873b362bf70d7b18f680e60b54e2098';
}
