import { Injectable, signal } from '@angular/core';
import { User } from '../models/user';

const AUTHTOKEN_KEY='AUTH__'
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _userDetails = signal<User | undefined>(undefined);
  
  private _authToken = signal<string | undefined>(undefined);
  private loggedIn = signal<boolean>(false);// computed(() => this.authToken() !== null);

  constructor(){

    const key = localStorage.getItem(AUTHTOKEN_KEY)
    
    if(key){
      const json = JSON.parse(key)
      this._authToken.set(json.token);
      this._userDetails.set(json.userDetails);
      this.loggedIn.set(true)
    }else{
      this.loggedIn.set(false)
    }

    console.log('Finished Initing UserService')
  }

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
    this.loggedIn.set(true)

    localStorage.setItem(AUTHTOKEN_KEY, JSON.stringify( {
      token: authToken, 
      userDetails: {
        ...details,
        idToken: ''
      }
    }) )
  }

  // Clear authentication data (logout)
  logout() {
    this._userDetails.set(undefined);
    this._authToken.set(undefined);
    this.loggedIn.set(false)

    localStorage.removeItem(AUTHTOKEN_KEY)
  }
}
