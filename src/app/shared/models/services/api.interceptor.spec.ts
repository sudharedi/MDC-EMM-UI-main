import { TestBed } from '@angular/core/testing';

import { ApiInterceptor } from './api.interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS, HttpResponse } from '@angular/common/http';
import { of, throwError, defer } from 'rxjs';
import { LoginService } from '../../../login/login.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

describe('ApiInterceptor', () => {
  let apiInterceptor;
  let authenticationServiceSpy;
  let cognitoService;
  let loginService: LoginService;
  let router: Router;
  let toastrService: ToastrService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ApiInterceptor
      ]
  }));

  beforeEach(() => {
    authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['logout']);
    loginService = jasmine.createSpyObj('LoginService', ['logout']);
    cognitoService = jasmine.createSpyObj('CognitoService', ['logout']);
    apiInterceptor = new ApiInterceptor(router, loginService, authenticationServiceSpy, toastrService);
  });

  it('should be created', () => {
    expect(apiInterceptor).toBeTruthy();
  });

  describe('intercept', () => {
    let httpRequestSpy;
    let httpHandlerSpy;
    const res = { body: { code: 401 }, status: 200 };
    it('Should logout when error response is 401', () => {
      httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
      httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
      httpHandlerSpy.handle.and.returnValue(new HttpResponse(res));
      spyOn(localStorage, 'clear');
      apiInterceptor.intercept(httpRequestSpy, httpHandlerSpy)
        .subscribe(
          result => {
            expect(localStorage.clear()).toHaveBeenCalled();
          },
          err => {
            expect(err).toEqual(err);
          }
        );
    });
  });
});
