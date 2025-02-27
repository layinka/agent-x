import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastsComponent } from './toasts/toasts.component';
import { GoogleLoginProvider, GoogleSigninButtonDirective, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { NgIf } from '@angular/common';
import { ApiService } from './services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WalletKeyModalComponent } from './wallet-key-modal/wallet-key-modal.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerModule, ToastsComponent, GoogleSigninButtonDirective, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-app';
  ngxSpinner = inject(NgxSpinnerService)
  authService = inject( SocialAuthService)
  apiService = inject(ApiService)
  private modalService = inject(NgbModal);

  user?: SocialUser;
  loggedIn: boolean=false;


  async ngOnInit(){
    // setTimeout(() => {
    //   this.ngxSpinner.show();
    // },3000)
    this.authService.authState.subscribe(async (user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log('USR::', user)

      if(this.loggedIn){
        // const authToken = await this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID);

        this.apiService.signupOnServerWithGoogle(user.idToken).subscribe((userData: any)=>{
          console.log('userData::', userData)
          if(true || (userData.privateKey && userData.privateKey.startsWith('0x') ) ){
            // showPrivate key
            const modalRef = this.modalService.open(WalletKeyModalComponent, {
              backdrop: 'static'
            });
		        modalRef.componentInstance.address = userData.user.walletAddress;
            modalRef.componentInstance.secretKey = userData.privateKey;
          }
        })

      }
    });
    
  }

  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

}
