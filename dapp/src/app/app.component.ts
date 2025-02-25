import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastsComponent } from './toasts/toasts.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerModule, ToastsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-app';
  ngxSpinner = inject(NgxSpinnerService)

  ngOnInit(){
    // setTimeout(() => {
    //   this.ngxSpinner.show();
    // },3000)
    
  }
}
