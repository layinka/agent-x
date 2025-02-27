import { Injectable, signal } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _userDetails = signal<User | undefined>(undefined);
  
  private _authToken = signal<string | undefined>(undefined);
  private loggedIn = signal<boolean>(false);// computed(() => this.authToken() !== null);

  // Getters
  get userDetails() {
    return this._userDetails();
  }

  get authToken() {
    return this._authToken();
  }

  get isLoggedIn() {
    return this.loggedIn();
  }

  // Set user authentication details
  setUserDetails(authToken: string, details: User) {
    this._userDetails.set(details);
    this._authToken.set(authToken);
  }

  // Clear authentication data (logout)
  logout() {
    this._userDetails.set(undefined);
    this._authToken.set(undefined);
  }
}
