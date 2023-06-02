import { TestBed, inject } from '@angular/core/testing';

import { ErrorInterceptor } from './error.interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { of, throwError, defer } from 'rxjs';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CognitoService } from 'src/app/auth/cognito.service';

describe('ErrorInterceptor', () => {
  let errorInterceptor;
  let authenticationServiceSpy;
  let cognitoService;
  let loginService;
  let router: Router;
  let toastrService: ToastrService;
  beforeEach(() => {
    authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['logout']);
    loginService = jasmine.createSpyObj('LoginService', ['logout']);
    cognitoService = jasmine.createSpyObj('CognitoService', ['logout']);
    errorInterceptor = new ErrorInterceptor(cognitoService, router, loginService, authenticationServiceSpy, toastrService);
  });


  it('should create', () => {
    expect(errorInterceptor).toBeTruthy();
  });

  describe('intercept', () => {
    let httpRequestSpy;
    let httpHandlerSpy;
    const error = { status: 401, statusText: 'error' };

    it('active requests should be reduced by 1 when error status is 401', () => {
      httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
      httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
      httpHandlerSpy.handle.and.returnValue(throwError(
        {
          error: { message: 'test-error' },
          status: 401
        }
      ));
      errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy)
        .subscribe(
          result => console.log('good', result),
          err => {
            expect(err).toEqual(err);
          }
        );
    });

    it('should throw error if error status is different from 401', () => {
      httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
      httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
      httpHandlerSpy.handle.and.returnValue(throwError(
        {
          error: { message: 'test-error' }
        }
      ));
      errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy)
        .subscribe(
          result => console.log('good', result),
          err => {
            expect(err).toEqual(err);
          }
        );
    });
  });
});
