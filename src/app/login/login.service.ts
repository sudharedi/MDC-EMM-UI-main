import { Injectable } from '@angular/core';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  public setAccessToken(data) {
    localStorage.setItem('token', data);
  }

  public getAccessToken() {
    return localStorage.getItem('token');
  }

  public setRefreshToken(data) {
    localStorage.setItem('refreshToken', data);
  }

  public getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  public setLoggedInUserDetails(data) {
    localStorage.setItem('loggedInUserDetails', JSON.stringify(data));
  }

  public getLoggedInUserDetails() {
    return localStorage.getItem('loggedInUserDetails') && JSON.parse(localStorage.getItem('loggedInUserDetails'));
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('loggedInUserDetails');
  }

}
