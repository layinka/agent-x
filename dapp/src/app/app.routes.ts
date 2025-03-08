import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WalletHomeComponent } from './pages/wallet/wallet-home/wallet-home.component';
import { AiChatComponent } from './pages/ai-chat/ai-chat.component';

export const routes: Routes = [
  { path: '', title: 'Home', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'wallet',
    title: 'Wallet',
    component: WalletHomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'chat',
    title: 'Agent X',
    component: AiChatComponent,
    pathMatch: 'full',
  },
  // { path: 'test', title: "Test", component: TestComponent },
];
