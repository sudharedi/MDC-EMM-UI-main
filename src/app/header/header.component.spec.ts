import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { BaseComponent } from '../base-component.component';
import { AuthService } from '../auth/auth.service';
import { AlertsService } from '../shared/models/services/alerts.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { alertsAndNotificationsList } from 'src/data/mockData/alertsAndNotifications';
import { of } from 'rxjs';
import { AlertsNotificationsComponent } from '../alerts-notifications/alerts-notifications.component';
import { DeviceService } from '../devices/device.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let alertsService: AlertsService;
  let deviceService: DeviceService;

  beforeEach(async(() => {
    const router = {
      navigate: jasmine.createSpy('navigate')

    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        })
      ],
      declarations: [
        HeaderComponent,
        BaseComponent
      ],
      providers: [
        AuthService,
        {
          provide: AlertsService, useValue: {
            fectAll: () => of([]),
            clearNotifications: () => of()
          }
        },
        {
          provide: DeviceService, useValue: {
            getCurrentUser: () => {
             return of(
                {
                firstName: 'A',
                lastName: 'Verma',
                role: 'admin',
                email: 'averma@proterra.com',
                tenantId: '2cbbfd0a-0ff7-4062-89da-bf2fa63807b7'
              }
             );
            }
          }
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    alertsService = TestBed.inject(AlertsService);
    deviceService = TestBed.inject(DeviceService);
    sessionStorage.setItem('socketObjectEventLogs', 
    '[{"deviceSerial":"189ba5405bcc","message":"1605166291482","type":"lastseen","dispensers":[]}]');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hideDropdown function should navigate to alertsnotifications', () => {
    spyOn(component, 'hideDropdown');
    component.hideDropdown();
    expect(component.hideDropdown).toHaveBeenCalled();
  });

  it('logout should call authService.logout()', () => {
    spyOn(component, 'logout').and.callThrough();
    component.logout();
    expect(component.logout).toHaveBeenCalled();
  });

  it('should get the list of alerts', () => {
    spyOn(component, 'getAlerts').and.callThrough();
    component.getAlerts();
    expect(component.getAlerts).toHaveBeenCalled();
    expect(component.getAlerts()).toEqual(alertsAndNotificationsList[1]);
    component.alertsData = alertsAndNotificationsList[1];
  });

  it('should clear the alerts', () => {
    spyOn(component, 'clearNotifications').and.callThrough();
    component.clearNotifications();
    expect(component.clearNotifications).toHaveBeenCalled();
  });

  it('should call ngDoCheck', () => {
    spyOn(component, 'ngDoCheck').and.callThrough();
    component.ngDoCheck();
    expect(component.ngDoCheck).toHaveBeenCalled();
  });
});
