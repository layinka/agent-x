import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: '', title: "Home", component: HomeComponent, pathMatch: 'full' },
    // { path: 'test', title: "Test", component: TestComponent },

];
