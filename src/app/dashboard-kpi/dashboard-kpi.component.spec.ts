import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardKpiComponent } from './dashboard-kpi.component';
import { DeviceService } from '../devices/device.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { DashboardKipMock } from 'src/data/mockData/dashboardKpi';
import { of } from 'rxjs';

describe('DashboardKpiComponent', () => {
  let component: DashboardKpiComponent;
  let fixture: ComponentFixture<DashboardKpiComponent>;
  let deviceService: DeviceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardKpiComponent ],
      imports: [HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        }), ],
      providers: [
        {
          provide: DeviceService, useValue: {
            getDevicesBystatus: () => of(DashboardKipMock)
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardKpiComponent);
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

  it('should call devices by status on load of page', () => {
    spyOn(component, 'getDevicesByStatus').and.callThrough();
    spyOn(deviceService, 'getDevicesBystatus').and.callThrough();
    component.getDevicesByStatus();
    fixture.detectChanges();
    expect(component.getDevicesByStatus).toHaveBeenCalled();
    expect(deviceService.getDevicesBystatus).toHaveBeenCalled();
  });
});
