import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-deposit-modal',
  imports: [],
  templateUrl: './deposit-modal.component.html',
  styleUrl: './deposit-modal.component.scss'
})
export class DepositModalComponent {
  @Input() coin: any;
  userService =inject (UserService);

  constructor(public activeModal: NgbActiveModal) {}
}
