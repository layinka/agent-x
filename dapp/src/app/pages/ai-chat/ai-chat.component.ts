import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { GoogleSigninButtonDirective, SocialAuthService } from '@abacritt/angularx-social-login';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastsComponent } from '../../toasts/toasts.component';
import { ActivatedRoute } from '@angular/router';
import { getExamplePromptForChatType, getPromptForChatType, getWelcomeMessage } from '../../models/prompts';
import { WalletKeyModalComponent } from '../../wallet-key-modal/wallet-key-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ai-chat',
  imports: [ReactiveFormsModule, CommonModule, GoogleSigninButtonDirective,  NgxSpinnerModule, ToastsComponent,],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss',
})
export class AiChatComponent {
  messages: { 
    role: 'system' | 'user' | 'assistant' | 'data'| 'agentX';
    content: string;
    id?: string;
    createdAt?: Date;
  }[] = [];
  // loading = false;
  responseText = '';
  promptInput = new FormControl('', [
    Validators.minLength(6),
    Validators.maxLength(640),
  ]);

  promptPlaceholder = 'Type in your Prompt ...'
  private apiService = inject(ApiService);
  userService = inject(UserService);
  authService = inject(SocialAuthService);
  private modalService = inject(NgbModal);
  private route: ActivatedRoute = inject(ActivatedRoute);
  spinner = inject(NgxSpinnerService)
  authStateSubscription: any;
  chatType: string=''
  ngOnInit(){

     setTimeout(() => {
      console.log('About to check logged in')
      if(!this.userService.isLoggedIn){
        this.authStateSubscription =  this.authService.authState.subscribe(async (user) => {

          
              
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

    this.route.paramMap.subscribe(params => {
      this.chatType = params.get('chatType') || '';
      this.messages=[]
      this.messages.push({
        role: 'system',
        content: getPromptForChatType(this.chatType)
      })
      this.messages.push({
        role: 'agentX',
        content: getWelcomeMessage(this.chatType)
      })
      this.promptPlaceholder= getExamplePromptForChatType(this.chatType)
    });


    // setTimeout(()=>{
    //   this.test()
    // },5500)
  }

  get messagesToBeShownToUsers() {
    return this.messages.filter(f=> f.role==='assistant' || f.role==='user' || f.role=='agentX');
  }

  sendPrompt() {
    const prompt = this.promptInput.value?.trim() ?? '';

    // Add user message to chat
    this.messages.push({ role: 'user', content: prompt });
    this.spinner.show()
    
    // call the Api
    this.apiService.submitPrompt( this.messages.filter(f=> f.role !='agentX')).subscribe({
      next: (res) => {
        // console.log('AI Response', res.fullResponse);
        if(res.fullResponse && res.fullResponse.length>1){
          const aiResponse = res.fullResponse
            .replace(/^\|[-\s|]+\|$/gm, '')
            .trim();
          this.messages.push({
            
            content: aiResponse,
            role: 'assistant'
          }) 
        }else{
          this.messages.push({
          
            content: 'Something went wrong. Confirm on the Block explorer if your transaction went through or try again. \n Also confimr you have enough balance and approvals to carry out your operations',
            role: 'agentX'
          }) 
        }

        this.spinner.hide()
      },
      error: (error) => {
        console.error( 'Error', error );
        // this.messages[this.messages.length -1].content = error
        this.messages.push({
          
          content: 'An Error happened',
          role: 'assistant'
        }) 
        this.spinner.hide()
      },
    });

    this.promptInput.reset();
  }

  test() {
    
    // // call the Api
    // this.apiService.test().subscribe({
    //   next: (res: any) => {
    //     console.log('AI Response', res);
    //     console.log('resp:',  res.fullResponse)
          
    //   },
    //   error: (error) => {
    //     console.error( 'Error', error );
        
    //   },
    // });

    // this.promptInput.reset();
  }


}
