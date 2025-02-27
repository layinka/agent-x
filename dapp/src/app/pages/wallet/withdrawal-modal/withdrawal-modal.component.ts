import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-withdrawal-modal',
  imports: [FormsModule,CommonModule ],
  templateUrl: './withdrawal-modal.component.html',
  styleUrl: './withdrawal-modal.component.scss'
})
export class WithdrawalModalComponent {
  @Input() coin: any;
  userService =inject (UserService);
  amount: number = 0;
  balance: number = 0;

  // client = createPublicClient({
  //   chain: mainnet,
  //   transport: http(),
  // });

  constructor(public activeModal: NgbActiveModal) {}

  async ngOnInit() {
    // const balance = await this.client.getBalance({ address: this.walletAddress });
    // this.balance = parseFloat(formatUnits(balance, 18));
  }

  withdraw() {
    if (this.amount <= this.balance) {
      console.log(`Withdrawing ${this.amount} ${this.coin.symbol}`);
      this.activeModal.close();
    }
  }
}
