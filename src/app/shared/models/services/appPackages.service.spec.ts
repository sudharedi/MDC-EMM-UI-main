import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { devicesList } from '../../../../data/mockData/devicesAndGroups';
import { AppPackageService } from '../services/appPackages.service';
import { InstalledApps } from '../../models/device.model';
import { ToastrModule } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseService } from '../../../base-service.service';
import { devicesListGrid } from '../../../../data/mockData/devicesAndGroups';

import { from } from 'rxjs';
// let httpClientSpy: { get: jasmine.Spy , post: jasmine.Spy, patch: jasmine.Spy, delete: jasmine.Spy,  errorHandler: jasmine.Spy};
describe('AppPackageService', () => {
  let service: AppPackageService;
  beforeEach(() => {
    // tslint:disable-next-line:max-line-length
    // const appPackageServiceSpy = jasmine.createSpyObj('AppPackageService', ['fectAll', 'updateDevicesApp', 'unInstallAppPackage', 'updateGroupAppPackages']);
    // httpClientSpy = jasmine.createSpyObj('HttpClient', ['errorHandler']);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        }),
        RouterTestingModule
      ],
      providers: [
        AppPackageService,
        BaseService
      ]
    });
    service = TestBed.inject(AppPackageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('on setUpdateType should set value to updateType variable', () => {
    spyOn(service, 'setUpdateType').and.callThrough();
    service.setUpdateType(3);
    expect(service.setUpdateType).toHaveBeenCalled();
    expect(service.updateType).toBe(3, 'failed to set update type value');
  });

  it('setDevicesCount should set value to devicesCount variable', () => {
    spyOn(service, 'setDevicesCount').and.callThrough();
    service.setDevicesCount(2);
    expect(service.setDevicesCount).toHaveBeenCalled();
    expect(service.devicesCount).toBe(2, 'failed to devicesCount type value');
  });

  it('setSelectedAppPackage', () => {
    spyOn(service, 'setSelectedAppPackage').and.callThrough();
    service.setSelectedAppPackage(devicesListGrid[0]);
    expect(service.setSelectedAppPackage).toHaveBeenCalled();
  });

  it('setNonCompatibleDeviceList', () => {
    spyOn(service, 'setNonCompatibleDeviceList').and.callThrough();
    service.setNonCompatibleDeviceList(devicesListGrid[0]);
    expect(service.setNonCompatibleDeviceList).toHaveBeenCalled();
  });

  it('setGroupId should set value to groupId variable', () => {
    spyOn(service, 'setGroupId').and.callThrough();
    service.setGroupId(4);
    expect(service.setGroupId).toHaveBeenCalled();
    expect(service.groupId).toBe(4, 'failed to groupId type value');
  });

  it('setVersionType should set value to updateVersion variable', () => {
    spyOn(service, 'setVersionType').and.callThrough();
    service.setVersionType('IOT-191');
    expect(service.setVersionType).toHaveBeenCalled();
    expect(service.updateVersion).toBe('IOT-191', 'failed to set groupId type value');
  });

  it('getSelectedDevicesCount should return devices count', () => {
    spyOn(service, 'getSelectedDevicesCount').and.callThrough();
    service.getSelectedDevicesCount();
    expect(service.getSelectedDevicesCount).toHaveBeenCalled();
  });

  it('getSelectedDeviceList should return selected devices list', () => {
    spyOn(service, 'getSelectedDeviceList').and.callThrough();
    service.getSelectedDeviceList();
    expect(service.getSelectedDeviceList).toHaveBeenCalled();
  });

  it('getUpdateType', () => {
    spyOn(service, 'getUpdateType').and.callThrough();
    service.getUpdateType();
    expect(service.getUpdateType).toHaveBeenCalled();
  });

  it('getSelectedAppPackage should return selected app package', () => {
    spyOn(service, 'getSelectedAppPackage').and.callThrough();
    service.getSelectedAppPackage();
    expect(service.getSelectedAppPackage).toHaveBeenCalled();
  });

  it('getNonCompatibleDeviceList should return compatible device list', () => {
    spyOn(service, 'getNonCompatibleDeviceList').and.callThrough();
    service.getNonCompatibleDeviceList();
    expect(service.getNonCompatibleDeviceList).toHaveBeenCalled();
  });

  it('getGroupId', () => {
    spyOn(service, 'getGroupId').and.callThrough();
    service.getGroupId();
    expect(service.getGroupId).toHaveBeenCalled();
  });

  it('getVersionType', () => {
    spyOn(service, 'getVersionType').and.callThrough();
    service.getVersionType();
    expect(service.getVersionType).toHaveBeenCalled();
  });

  it('resetValues should pass following', () => {
    spyOn(service, 'resetValues').and.callThrough();
    service.resetValues();
    expect(service.resetValues).toHaveBeenCalled();
    expect(service.updateType).toBe(null);
    expect(service.selectedDevices).toEqual([]);
    expect(service.devicesCount).toBe(null);
    expect(service.selectedAppPackage).toBe(null);
    expect(service.updateVersion).toBe(null);
  });

  it('fectAll', () => {
    spyOn(service, 'fectAll').and.callThrough();
    service.fectAll();
    expect(service.fectAll).toHaveBeenCalled();
  });

  it('updateDevicesApp', () => {
    spyOn(service, 'updateDevicesApp').and.callThrough();
    service.updateDevicesApp('sampleDate');
    expect(service.updateDevicesApp).toHaveBeenCalled();
  });

  it('unInstallAppPackage', () => {
    spyOn(service, 'unInstallAppPackage').and.callThrough();
    service.unInstallAppPackage('sampleDate');
    expect(service.unInstallAppPackage).toHaveBeenCalled();
  });

  it('updateGroupAppPackages', () => {
    spyOn(service, 'updateGroupAppPackages').and.callThrough();
    service.updateGroupAppPackages('sampleData', 'sampleData');
    expect(service.updateGroupAppPackages).toHaveBeenCalled();
  });

  it('cancelAppPackageInstallationForPendingStatus', () => {
    spyOn(service, 'cancelAppPackageInstallationForPendingStatus').and.callThrough();
    service.cancelAppPackageInstallationForPendingStatus('sampleData', 'sampleData');
    expect(service.cancelAppPackageInstallationForPendingStatus).toHaveBeenCalled();
  });
});
