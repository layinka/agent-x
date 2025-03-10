import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastsComponent } from './toasts/toasts.component';
import { GoogleLoginProvider, GoogleSigninButtonDirective, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { CommonModule, NgIf } from '@angular/common';
import { ApiService } from './services/api.service';
import { NgbDropdown, NgbDropdownItem, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WalletKeyModalComponent } from './wallet-key-modal/wallet-key-modal.component';
import { UserService } from './services/user.service';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NgxSpinnerModule, ToastsComponent, GoogleSigninButtonDirective, NgIf, 
     NgbDropdownModule, CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-app';
  isHomePage = new BehaviorSubject<boolean>(false);

  ngxSpinner = inject(NgxSpinnerService)
  authService = inject( SocialAuthService)
  apiService = inject(ApiService)
  private modalService = inject(NgbModal);
  userService = inject( UserService );
  private router = inject( Router )

  constructor()
  {
    this.router.events.subscribe( () =>
    {
    this.isHomePage.next(this.router.url === '/')
  })
}

  authStateSubscription: any;

  async ngOnInit(){
    setTimeout(() => {
      console.log('About to check logged in')
      if(!this.userService.isLoggedIn){
        this.authStateSubscription =  this.authService.authState.subscribe(async (user) => {

          console.log('AUTHSTATE::', user)
              
          if(user != null){
            
            this.apiService.signupOnServerWithGoogle(user.idToken).subscribe(({data:userData}: any)=>{
              console.log('userData::', userData, userData.token.token)
              this.userService.setUserDetails(userData.token.token, {
                idToken: user.idToken,
                email: user.email,
                firstName:user.firstName,
                lastName: user.lastName,
                name: user.lastName,
                id: userData.user.id,
                photoUrl: user.photoUrl,
                walletAddress: userData.user.walletAddress
              });
    
              if( (userData.walletSecret && userData.walletSecret.startsWith('0x') ) ){
                // showPrivate key
                const modalRef = this.modalService.open(WalletKeyModalComponent, {
                  backdrop: 'static'
                });
                modalRef.componentInstance.address = userData.user.walletAddress;
                modalRef.componentInstance.secretKey = userData.walletSecret;
              }
            })
    
          }
        });
      }
    },1000)

    
    
    
    
  }

  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

}
