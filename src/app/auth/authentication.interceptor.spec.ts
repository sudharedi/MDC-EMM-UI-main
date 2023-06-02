import { inject, TestBed } from '@angular/core/testing';

import { AuthenticationInterceptor } from './authentication.interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from '../login/login.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
describe('AuthenticationInterceptor', () => {
  const currentToken = 'eyJraWQiOiJ6Q2NlOU5pOFRpMm9HSlI1V3h0Sk1XaVV2TVRUZzRFUEpKVDJNVnJFQzB3PSIsImFsZyI6IlJTMjU2In0';
  const commonURL = 'http://ec2-54-145-54-20.compute-1.amazonaws.com:8088/proterra/controlpanel/';

  beforeEach(() => {
    const loginServiceStub = {
      getAccessToken: () => ({ currentToken })
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationInterceptor,
        {
          provide: LoginService,
          useValue: loginServiceStub
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthenticationInterceptor,
          multi: true
        }
      ]
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should be created', () => {
    const interceptor: AuthenticationInterceptor = TestBed.inject(AuthenticationInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    http.get(commonURL + 'users').subscribe(
      response => {
        expect(response).toBeTruthy();
      }
    );
    const request = httpMock.expectOne(
      commonURL + 'users'
    );
    expect(request.request.method).toEqual('GET');
    request.flush({ hello: 'world' });
    httpMock.verify();
  }));
});
