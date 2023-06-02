import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { DeviceService } from '../devices/device.service';
import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { devicesList, MetricsMock } from '../../data/mockData/devicesAndGroups';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let deviceService: DeviceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        }),
      ],
      providers: [
        {
          provide: DeviceService, useValue: {
            getDevices: () => of(devicesList),
            getMetrics: () => of(MetricsMock)
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    deviceService = TestBed.inject(DeviceService);
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

  it('should get the list of devices', () => {
    component.getDevices();
    const params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '10')
      .set('sortDirection', 'ASC')
      .set('search', '')
      .set('searchTerm', '');
    expect(component.getDevices()).toEqual(devicesList[1]);
  });

  it('should get the list of meticsdata', () => {
    const metricsData = {
      offline: 5,
      faulted: 20,
      chargning: 23,
      booting: 9
    };
    component.getMetrics();
    const params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '10')
      .set('sortDirection', 'ASC')
      .set('search', '')
      .set('searchTerm', '');
    expect(component.getMetrics()).toEqual(metricsData[1]);
  });

  it('viewPage', () => {
    spyOn(component, 'viewPage').and.callThrough();
    component.viewPage('online');
    expect(component.viewPage).toHaveBeenCalled();
  });

  it('getDevices', () => {
    spyOn(component, 'getDevices').and.callThrough();
    spyOn(deviceService, 'getDevices').and.callThrough();
    component.getDevices();
    fixture.detectChanges();
    expect(component.getDevices).toHaveBeenCalled();
    expect(deviceService.getDevices).toHaveBeenCalled();
    expect(component.totalDeviceCount).toEqual(devicesList.totalElements);
  });

  it('getMetrics', () => {
    spyOn(component, 'getMetrics').and.callThrough();
    spyOn(deviceService, 'getMetrics').and.callThrough();
    component.getMetrics();
    fixture.detectChanges();
    expect(component.getMetrics).toHaveBeenCalled();
    expect(deviceService.getMetrics).toHaveBeenCalled();
    expect(component.metricsData).toEqual(MetricsMock);
  });
});
