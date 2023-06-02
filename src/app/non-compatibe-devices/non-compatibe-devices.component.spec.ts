import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NonCompatibeDevicesComponent } from './non-compatibe-devices.component';
import { AppPackageService } from '../shared/models/services/appPackages.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { devicesListGrid } from '../../data/mockData/devicesAndGroups';

describe('NonCompatibeDevicesListComponent', () => {
  let component: NonCompatibeDevicesComponent;
  let fixture: ComponentFixture<NonCompatibeDevicesComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NonCompatibeDevicesComponent],
      imports: [HttpClientTestingModule,
        RouterTestingModule,
        ModalModule.forRoot(),
        ToastrModule.forRoot({
          preventDuplicates: true
        })],
      providers: [
        AppPackageService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonCompatibeDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on ngOnInit it should call getNonCompatibleDeviceList()', () => {
    spyOn(component, 'getNonCompatibleDeviceList').and.callThrough();
    component.ngOnInit();
    expect(component.getNonCompatibleDeviceList).toHaveBeenCalled();
  });

  it('should call updateDeviceApp', () => {
    const values = {
      devices: devicesListGrid,
      force: true,
      restart: false,
      softwarePackageId: 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c'
    };
    spyOn(component, 'updateDeviceApp').and.callThrough();
    component.updateDeviceApp();
    expect(component.updateDeviceApp).toHaveBeenCalled();
  });

  it('on closePopUp it should set restartDevice to false', () => {
    spyOn(component, 'closePopUp').and.callThrough();
    component.closePopUp();
    expect(component.closePopUp).toHaveBeenCalled();
    expect(component.restartDevice).toBe(false);
  });

  it('on ignoreAndProceed() it should give totalCompatibleDeviceCount', () => {
    component.deviceList = devicesListGrid;
    component.nonCompatibleDeviceList = devicesListGrid;
    spyOn(component, 'ignoreAndProceed').and.callThrough();
    component.ignoreAndProceed();
    expect(component.ignoreAndProceed).toHaveBeenCalled();
    expect(component.totalCompatibleDeviceCount).toBe(0);
  });

  it('on ignoreAndProceed() it should give totalCompatibleDeviceCount', () => {
    component.totaldeviceCount = 2;
    component.nonCompatibleDeviceList = devicesListGrid;
    component.updateType = 1;
    spyOn(component, 'ignoreAndProceed').and.callThrough();
    component.ignoreAndProceed();
    expect(component.ignoreAndProceed).toHaveBeenCalled();
    expect(component.totalCompatibleDeviceCount).toBe(0);
  });

  it('changeAppVersion', () => {
    spyOn(component, 'changeAppVersion').and.callThrough();
    component.changeAppVersion();
    expect(component.changeAppVersion).toHaveBeenCalled();
  });
});
