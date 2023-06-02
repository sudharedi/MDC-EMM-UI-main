import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CompatibeDevicesComponent } from './compatibe-devices.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import { DeviceService } from '../devices/device.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { devicesList } from '../../data/mockData/devicesAndGroups';
import { devicesListGrid } from '../../data/mockData/devicesAndGroups';
import { appPackagesMock } from '../../data/mockData/appPackageService.mock';
import { of } from 'rxjs';
import { AppPackageService } from '../shared/models/services/appPackages.service';
import { FirmwareService } from '../firmware/firmware.service';

describe('CompatibeDevicesComponent', () => {
  let component: CompatibeDevicesComponent;
  let fixture: ComponentFixture<CompatibeDevicesComponent>;
  let deviceService: DeviceService;
  let appPackageService: AppPackageService;
  let firmwareService: FirmwareService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompatibeDevicesComponent],
      imports: [HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        }),
        ModalModule.forRoot()],
      providers: [
        {
          provide: DeviceService, useValue: {
            getDevices: () => of(devicesList),
            getEligibleDeviceForSoftwarePackageId: (softwarePackageId, params) => of(devicesList)
          }
        },
        {
          provide: AppPackageService, useValue: {
            updateDevicesApp: () => of('sampleData'),
            resetValues: () => of()
          }
        },
        {
          provide: FirmwareService, useValue: {
            updateDevicesFirmware: (deviceSelectedForFirmwareUpdate) => of('sampleData'),
            resetValues: () => of()
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompatibeDevicesComponent);
    component = fixture.componentInstance;
    component.appVersion = 'appUpdate';
    component.firmwareVersion = 'firmwareUpdate';
    deviceService = TestBed.inject(DeviceService);
    appPackageService = TestBed.inject(AppPackageService);
    firmwareService = TestBed.inject(FirmwareService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getDeviceList', () => {
    spyOn(component, 'getDeviceList').and.callThrough();
    spyOn(deviceService, 'getDevices').and.callThrough();
    component.ngOnInit();
    component.firmwareVersion = 'firmwareUpdate';
    component.getDeviceList();
    expect(component.getDeviceList).toHaveBeenCalled();
    expect(deviceService.getDevices).toHaveBeenCalled();
  });

  it('should get the list of devices', () => {
    component.getDeviceList();
    const params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '10')
      .set('sortDirection', 'ASC')
      .set('search', '')
      .set('searchTerm', '');
    expect(component.getDeviceList()).toEqual(devicesList[1]);
  });

  it('should call getCompatibleDeviceList method', () => {
    spyOn(component, 'getCompatibleDeviceList').and.callThrough();
    spyOn(deviceService, 'getEligibleDeviceForSoftwarePackageId').and.callThrough();
    component.getCompatibleDeviceList();
    expect(component.getCompatibleDeviceList).toHaveBeenCalled();
    expect(deviceService.getEligibleDeviceForSoftwarePackageId).toHaveBeenCalled();
  });

  it('should get the list of compatible devices', () => {
    component.getCompatibleDeviceList();
    const params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '10')
      .set('softwarePackageId', 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c');
    expect(component.getDeviceList()).toEqual(devicesList[1]);
  });

  it('should call goToFirmware() method on firmware click', () => {
    spyOn(component, 'goToFirmware');
    component.goToFirmware();
    expect(component.goToFirmware).toHaveBeenCalled();
  });

  it('should call goToApps() method on firmware click', () => {
    spyOn(component, 'goToApps');
    component.goToApps();
    expect(component.goToApps).toHaveBeenCalled();
  });

  it('should call updateDeviceApp', () => {
    component.deviceSelectedForFirmwareUpdate = {
      devices: devicesListGrid,
      firmwareVersion: 'v16.09.2020-HF123'
    };
    spyOn(component, 'updateAllDeviceWithFirmware');
    component.updateAllDeviceWithFirmware();
    expect(component.updateAllDeviceWithFirmware).toHaveBeenCalled();
  });

  it('should call pageChanged()', async(() => {
    spyOn(component, 'pageChanged').and.callThrough();
    spyOn(component, 'getDeviceList');
    component.pageChanged(1);
    fixture.detectChanges();
    expect(component.pageChanged).toHaveBeenCalled();
    expect(component.selcetedPageNum).toBe(0, 'failed to assign value 0 to selectedPageNum');
  }));

  it('should call updateFirmware() ', () => {
    spyOn(component, 'updateFirmware').and.callThrough();
    spyOn(firmwareService, 'updateDevicesFirmware').and.callThrough();
    component.updateFirmware();
    expect(component.updateFirmware).toHaveBeenCalled();
    expect(firmwareService.updateDevicesFirmware).toHaveBeenCalled();
  });

  it('on getSelectedAppPackage() function should set softwarePackageId and selectedPackageName', () => {
    component.appPackage = appPackagesMock[0];
    spyOn(component, 'getSelectedAppPackage').and.callThrough();
    component.getSelectedAppPackage();
    expect(component.getSelectedAppPackage).toHaveBeenCalled();
    expect(component.softwarePackageId).toBe(appPackagesMock[0].id);
    expect(component.selectedPackageName).toBe('other_app3');
  });

  it('on getSelectedFirmware() function should set selectedPackageName', () => {
    component.firmwarePackage = {
      firmwareVersion: 'CP-70000000067'
    };
    spyOn(component, 'getSelectedFirmware').and.callThrough();
    component.getSelectedFirmware();
    expect(component.getSelectedFirmware).toHaveBeenCalled();
    expect(component.selectedPackageName ).toBe(component.firmwarePackage.firmwareVersion);
  });

  it('on updateAll() function should be called', () => {
    spyOn(component, 'updateAll').and.callThrough();
    spyOn(component, 'updateDeviceApp').and.callThrough();
    component.updateAll();
    expect(component.updateAll).toHaveBeenCalled();
    expect(component.updateDeviceApp).toHaveBeenCalled();
  });

  it('on update() function should be called', () => {
    spyOn(component, 'update').and.callThrough();
    component.update();
    expect(component.update).toHaveBeenCalled();
  });

  it('on updateAppPackageForSelectedDevice() function should be called', () => {
    spyOn(component, 'updateAppPackageForSelectedDevice').and.callThrough();
    spyOn(component, 'updateDeviceApp').and.callThrough();
    component.updateAppPackageForSelectedDevice();
    expect(component.updateAppPackageForSelectedDevice).toHaveBeenCalled();
    expect(component.updateDeviceApp).toHaveBeenCalled();
  });

  it('on selectedDevices() function should call', () => {
    spyOn(component, 'selectedDevices').and.callThrough();
    component.selectedDevices('event');
    expect(component.selectedDevices).toHaveBeenCalled();
  });

  it('on closePopUp() function should set restartDevice flag to false', () => {
    spyOn(component, 'closePopUp').and.callThrough();
    component.closePopUp();
    expect(component.closePopUp).toHaveBeenCalled();
    expect(component.restartDevice).toBe(false, 'failed to set restartDevice value to false');
  });

  it('on updateDevicesWithFirmware() should open update Devices With Firmware modal', () => {
    spyOn(component, 'updateDevicesWithFirmware').and.callThrough();
    component.updateDevicesWithFirmware();
    expect(component.updateDevicesWithFirmware).toHaveBeenCalled();
  });

  it('on updateFirmwareForSelectedDevices() function should be called', () => {
    spyOn(component, 'updateFirmwareForSelectedDevices').and.callThrough();
    spyOn(component, 'updateFirmware').and.callThrough();
    component.updateFirmwareForSelectedDevices();
    expect(component.updateFirmwareForSelectedDevices).toHaveBeenCalled();
    expect(component.updateFirmware).toHaveBeenCalled();
  });

  it('on goToApps() should navigate to apps', () => {
    spyOn(component, 'goToApps').and.callThrough();
    component.goToApps();
    expect(component.goToApps).toHaveBeenCalled();
  });

  it('on goToFirmware() should navigate to firmware', () => {
    spyOn(component, 'goToFirmware').and.callThrough();
    component.goToFirmware();
    expect(component.goToFirmware).toHaveBeenCalled();
  });
});
