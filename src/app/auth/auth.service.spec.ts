import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { CognitoService, CognitoCallback } from './cognito.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { LoginService } from '../login/login.service';

describe('AuthService', () => {
  let service: AuthService;
  const callback: CognitoCallback = null;

  const router = {
    navigate: jasmine.createSpy('navigate')
  };
  const loginServiceStub = {
    logout: () => ({})
  };
  beforeEach(() => {
    const cognitoServiceStub = {
      getUserPool: () => ({})
    };
    TestBed.configureTestingModule({
      providers: [AuthService,
        {
          provide: CognitoService, useValue: cognitoServiceStub
        },
        {
          provide: Router, useValue: router
        },
        {
          provide: LoginService,
          useValue: loginServiceStub
        },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call authenticate', () => {
    spyOn(service, 'authenticate');
    service.authenticate('speruboina@innominds.com', 'Indian@29', callback);
    expect(service.authenticate).toHaveBeenCalled();
  });

  it('should call logout', () => {
    spyOn(service, 'logout');
    service.logout();
    expect(service.logout).toHaveBeenCalled();
  });
});
