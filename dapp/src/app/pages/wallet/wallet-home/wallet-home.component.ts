import { Component, inject, Input } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../../services/api.service';
import { AppToastService } from '../../../services/app-toast.service';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { DepositModalComponent } from '../deposit-modal/deposit-modal.component';
import { WithdrawalModalComponent } from '../withdrawal-modal/withdrawal-modal.component';

@Component({
  selector: 'app-wallet-home',
  imports: [CommonModule, NgxSpinnerModule, NgbModalModule],
  templateUrl: './wallet-home.component.html',
  styleUrl: './wallet-home.component.scss'
})
export class WalletHomeComponent {
  ngxSpinner = inject(NgxSpinnerService)
  appToastService = inject(AppToastService)
  apiService = inject(ApiService)
  private modalService = inject(NgbModal);
  userService =inject (UserService);
  
  
  @Input() balances: {name: string, symbol: string; amount: number, address: string  }[] = [
    {name: 'SONIC', symbol: 'SONIC', amount: 50, address: '0x' },
    {name: 'USD Circle', symbol: 'USDC', amount: 200 , address: '0x' },
    {name: 'DAI', symbol: 'DAI', amount: 150, address: '0x'  }
  ];
  recentTransactions = [
    { type: 'Deposit', symbol: 'SONIC', amount: 10, date: '2024-02-26' },
    { type: 'Withdraw', symbol: 'USDC', amount: 50, date: '2024-02-25' }
  ];

  constructor() {}

  ngOnInit(){

  }

  openDepositModal(coin: any) {
    const modalRef = this.modalService.open(DepositModalComponent);
    modalRef.componentInstance.coin = coin;
  }

  openWithdrawalModal(coin: any) {
    const modalRef = this.modalService.open(WithdrawalModalComponent);
    modalRef.componentInstance.coin = coin;
    
  }
}
