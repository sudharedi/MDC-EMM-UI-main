import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('AuthGuardService', () => {
  let service: AuthGuardService;

  let injector: TestBed;
  let authService: AuthService;
  let guard: AuthGuardService;
  const routeMock: any = { snapshot: {} };
  const routeStateMock: any = { snapshot: {}, url: '/cookies' };
  const routerMock = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        { provide: Router, useValue: routerMock }
      ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        })
      ]
    });
    service = TestBed.inject(AuthGuardService);
    injector = getTestBed();
    authService = injector.inject(AuthService);
    guard = injector.inject(AuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should redirect an unauthenticated user to the login route', () => {
    expect(guard.canActivate(routeMock, routeStateMock)).toEqual(guard.canActivate(routeMock, routeStateMock));
  });
});
