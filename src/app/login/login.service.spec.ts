import { TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';

describe('LoginService', () => {
  let loginService: LoginService;

  const cognitoResponse = {
    idToken: {
      jwtToken: `eyJraWQiOiJ6Q2NlOU5pOFRpMm9HSlI1V3h0Sk1XaVV2TVRUZzRFUEpKVDJNVnJFQzB3PSIsImFsZyI6IlJTMjU2In0.`,
      payload: {
        aud: '5ohjqghn2il2blsh3rgph4euks',
        auth_time: 1572801892,
        cognitousername: '529d1ff2-bdd0-4284-8053-1bf098db27a5',
        email: 'speruboina@innominds.com',
        email_verified: true,
        event_id: 'e25008fe-0cda-4277-825b-7e8c5acb0009',
        exp: 1572805492,
        family_name: 'rani',
        given_name: 'sandhya',
        iat: 1572801892,
        iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_cJabLTMz2',
        profile: 'Admin',
        sub: '529d1ff2-bdd0-4284-8053-1bf098db27a5',
        token_use: 'id'
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    loginService = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(loginService).toBeTruthy();
  });

  it('get the access token', () => {
    spyOn(loginService, 'getAccessToken').and.callThrough();
    loginService.getAccessToken();
    expect(loginService.getAccessToken).toHaveBeenCalled();
  });

  it('get the loggedin user details', () => {
    spyOn(loginService, 'getLoggedInUserDetails').and.callThrough();
    loginService.getLoggedInUserDetails();
    expect(loginService.getLoggedInUserDetails).toHaveBeenCalled();
  });

  it('set the access token', () => {
    spyOn(loginService, 'setAccessToken').and.callThrough();
    loginService.setAccessToken(cognitoResponse.idToken.jwtToken);
    expect(loginService.setAccessToken).toHaveBeenCalled();
  });

  it('set the logged in user details', () => {
    spyOn(loginService, 'setLoggedInUserDetails').and.callThrough();
    loginService.setLoggedInUserDetails(cognitoResponse.idToken.payload);
    expect(loginService.setLoggedInUserDetails).toHaveBeenCalled();
  });

  it('logout to be called', () => {
    spyOn(loginService, 'logout').and.callThrough();
    loginService.logout();
    expect(loginService.logout).toHaveBeenCalled();
  });

  it('get refresh token from localstorage', () => {
    spyOn(loginService, 'getRefreshToken').and.callThrough();
    loginService.getRefreshToken();
    expect(loginService.getRefreshToken).toHaveBeenCalled();
  });

  it('set refresh token to localstorage', () => {
    spyOn(loginService, 'setRefreshToken').and.callThrough();
    loginService.setRefreshToken(cognitoResponse);
    expect(loginService.setRefreshToken).toHaveBeenCalled();
  });
});
