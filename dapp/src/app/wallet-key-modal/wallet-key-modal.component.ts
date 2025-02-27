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
  @Input() secretKey: string='';
}
