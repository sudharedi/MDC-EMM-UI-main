import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DeviceService } from '../devices/device.service';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let deviceService: DeviceService;

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
    },
    refreshToken: {
      token: 'eyJraWQiOiJxdWxRc2RFWmw2ckZydGdCajExY0NLRktkdUUzVjRjWGRlS0N0TzBnbTJ3PSIsImFsZyI6IlJTMjU2In0.'
    }
  };

  const loginDetails = {
    username: 'speruboina@innominds.com',
    password: 'Indian@29'
  };

  const cognitoRes = {
    accessToken: 'CognitoAccessToken',
    jwtToken: 'eyJraWQiOiJaYXR1TWNKRFNcLzlpNUpmOVoyRTVDMGx6UDlnSHp6ZDlINGk5UWtaRzZUUT0iLCJhbGciOiJSUzI1NiJ9.',
    payload: {
      auth_time: 1603172557,
      client_id: 'glvhg0hqhqqbdfuarvfsug4rt',
      event_id: 'f70b8dd1-35b1-4d39-a744-ca09a04370a5',
      exp: 1603176157,
      iat: 1603172557,
      iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_TNryPv9dQ',
      jti: 'f682499a-8ec7-4c2b-a5c7-e442ce494c50',
      scope: 'aws.cognito.signin.user.admin',
      sub: 'c490fe05-ea1b-40ae-ac4e-901b1dfc69e5',
      token_use: 'access',
      username: 'c490fe05-ea1b-40ae-ac4e-901b1dfc69e5'
    }
  };
  const message = '';
  const isLoggedIn = true;

  beforeEach(async(() => {
    const loginServiceStub = {
      setAccessToken: (a) => ({}),
      setLoggedInUserDetails: (userDetails) => ({
      }),
      setRefreshToken: (a) => ({}),
    };
    const authServiceStub = {
      authenticate: (uname, password, components) => ({}),
      isAuthenticated: (components) => ({})
    };
    const router = {
      navigate: jasmine.createSpy('navigate')

    };
    const currentRoute = { snapshot: { queryParams: () => ({}) } };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        })
      ],
      declarations: [ LoginComponent ],
      providers: [
        { provide: LoginService, useValue: loginServiceStub },
        { provide: AuthService, useValue: authServiceStub },
        {
          provide: Router, useValue: router
        },
        {
          provide: ActivatedRoute, useValue: currentRoute
        },
        {
          provide: DeviceService, useValue: {
            getCurrentUser: () => of(
              {
                email: 'averma@proterra.com',
                firstName: 'A',
                lastName: 'Verma',
                role: 'admin',
                tenantId: '2cbbfd0a-0ff7-4062-89da-bf2fa63807b7'
              }
            ),
            getRole: () => of(
              {
                tabs: [
                  {
                    FOTA: {
                      allowed: true,
                       enable: true,
                       name: 'read-write'
                     }
                  }
                ]
              }
            ),
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cognitoCallBack function branches', () => {
    const loginServiceStub: LoginService = fixture.debugElement.injector.get(
      LoginService
    );
    spyOn(component, 'cognitoCallback').and.callThrough();
    component.cognitoCallback(null, cognitoResponse);
    spyOn(loginServiceStub, 'setAccessToken').and.callThrough();
    spyOn(loginServiceStub, 'setLoggedInUserDetails').and.callThrough();
    spyOn(loginServiceStub, 'setRefreshToken').and.callThrough();
    expect(component.cognitoCallback).toHaveBeenCalled();
    loginServiceStub.setAccessToken(cognitoResponse.idToken.jwtToken);
    loginServiceStub.setLoggedInUserDetails(cognitoResponse.idToken.payload);
    expect(loginServiceStub.setAccessToken).toHaveBeenCalled();
    expect(loginServiceStub.setLoggedInUserDetails).toHaveBeenCalled();
  });

  it('navigate to devices on successful login', () => {
    const authServiceStub: AuthService = fixture.debugElement.injector.get(
      AuthService
    );
    spyOn(component, 'navigateToDashboard').and.callThrough();
    component.navigateToDashboard();
    spyOn(authServiceStub, 'authenticate').and.callThrough();
    authServiceStub.authenticate(loginDetails.username, loginDetails.password, component);
    expect(component.navigateToDashboard).toHaveBeenCalled();
    expect(authServiceStub.authenticate).toHaveBeenCalled();
  });

  it('isLoggedIn to be called', () => {
    spyOn(component, 'isLoggedIn').and.callThrough();
    component.isLoggedIn(message, isLoggedIn);
    expect(component.isLoggedIn).toHaveBeenCalled();
  });

  it('isLoggedIn to be called', () => {
    spyOn(component, 'isLoggedIn').and.callThrough();
    component.isLoggedIn(message, false);
    expect(component.isLoggedIn).toHaveBeenCalled();
  });

  it('ngOnInIt', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    const authServiceStub: AuthService = fixture.debugElement.injector.get(
      AuthService
    );
    spyOn(authServiceStub, 'isAuthenticated').and.callThrough();
    authServiceStub.isAuthenticated(component);
    expect(authServiceStub.isAuthenticated).toHaveBeenCalled();
  });

  it('getRoles to be called', () => {
    spyOn(component, 'getRoles').and.callThrough();
    component.getRoles();
    expect(component.getRoles).toHaveBeenCalled();
  });
});
