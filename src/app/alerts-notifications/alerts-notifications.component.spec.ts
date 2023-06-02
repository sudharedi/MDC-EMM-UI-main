import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsNotificationsComponent } from './alerts-notifications.component';
import { AlertsService } from '../shared/models/services/alerts.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { alertsAndNotificationsList } from 'src/data/mockData/alertsAndNotifications';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('AlertsNotificationsComponent', () => {
  let component: AlertsNotificationsComponent;
  let fixture: ComponentFixture<AlertsNotificationsComponent>;
  let alertsService: AlertsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertsNotificationsComponent ],
      imports: [HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        }), ],
      providers: [
        {
          provide: AlertsService, useValue: {
            fectAll: () => of([]),
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsNotificationsComponent);
    component = fixture.componentInstance;
    alertsService = TestBed.inject(AlertsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should get the list of devices by status', () => {
    component.getAlerts();
    expect(component.getAlerts()).toEqual(alertsAndNotificationsList[1]);
    component.alertsData = alertsAndNotificationsList[1];
  });

  it('headding should be Alerts & Notifications', () => {
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('.mainheading'));
    expect(header.nativeElement.textContent).toBe('Alerts & Notifications');
  });

  it('getAlerts', () => {
    spyOn(component, 'getAlerts').and.callThrough();
    spyOn(alertsService, 'fectAll').and.callThrough();
    component.getAlerts();
    expect(alertsService.fectAll).toHaveBeenCalled();
    expect(component.getAlerts).toHaveBeenCalled();
  });
});
