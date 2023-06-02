import { TestBed, async } from '@angular/core/testing';

import { FirmwareService } from './firmware.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BaseService } from '../base-service.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy, patch: jasmine.Spy, delete: jasmine.Spy, errorHandler: jasmine.Spy };

describe('FirmwareService', () => {
  let service: FirmwareService;
  let baseService: BaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        }),
      ],
      providers: [BaseService]
    });
    service = TestBed.inject(FirmwareService);
    baseService = TestBed.inject(BaseService);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch', 'delete', 'errorHandler']);
    baseService = new BaseService(httpClientSpy as any, ToastrService as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http get method one time', () => {
    httpClientSpy.get.and.returnValue(of({}));
    baseService.get('testUrl');

    expect(httpClientSpy.get.calls.count()).toBe(1, 'get method should call one time');
  });

  it('should call http post method one time', () => {
    httpClientSpy.post.and.returnValue(of({}));
    baseService.post('testUrl', HttpParams);

    expect(httpClientSpy.post.calls.count()).toBe(1, 'post method should call one time');
  });

  it('should return an error when the server returns a 404', async(() => {
    const errorMessage = new HttpErrorResponse({
      error: {
        error:
        {
          message: 'server error'
        }
      }
    });
    expect(httpClientSpy.errorHandler.and.returnValue(errorMessage));
  }));

  it('should call setUpdateType one time', () => {
    const setUpdateTypeSpy = spyOn(service, 'setUpdateType').and.callThrough();
    service.setUpdateType(1);
    expect(setUpdateTypeSpy).toHaveBeenCalled();
  });

  it('should call setDevicesList one time', () => {
    const setDevicesListSpy = spyOn(service, 'setDevicesList').and.callThrough();
    service.setDevicesList([]);
    expect(setDevicesListSpy).toHaveBeenCalled();
  });

  it('should call setDevicesCount one time', () => {
    const setDevicesCountSpy = spyOn(service, 'setDevicesCount').and.callThrough();
    service.setDevicesCount(1);
    expect(setDevicesCountSpy).toHaveBeenCalled();
  });

  it('should call setSelectedFirmware one time', () => {
    const setSelectedFirmwareSpy = spyOn(service, 'setSelectedFirmware').and.callThrough();
    service.setSelectedFirmware([]);
    expect(setSelectedFirmwareSpy).toHaveBeenCalled();
  });

  it('should call setGroupId one time', () => {
    const setGroupIdSpy = spyOn(service, 'setGroupId').and.callThrough();
    service.setGroupId('sampleId');
    expect(setGroupIdSpy).toHaveBeenCalled();
  });

  it('should call setPageType one time', () => {
    const setPageTypeSpy = spyOn(service, 'setPageType').and.callThrough();
    service.setPageType('sampleId');
    expect(setPageTypeSpy).toHaveBeenCalled();
  });

  it('should call setVersionType one time', () => {
    const setVersionTypeSpy = spyOn(service, 'setVersionType').and.callThrough();
    service.setVersionType('sampleName');
    expect(setVersionTypeSpy).toHaveBeenCalled();
  });

  it('should call getSelectedDevicesCount one time', () => {
    const getSelectedDevicesCountSpy = spyOn(service, 'getSelectedDevicesCount').and.callThrough();
    service.getSelectedDevicesCount();
    expect(getSelectedDevicesCountSpy).toHaveBeenCalled();
  });

  it('should call getSelectedDeviceList one time', () => {
    const getSelectedDeviceListSpy = spyOn(service, 'getSelectedDeviceList').and.callThrough();
    service.getSelectedDeviceList();
    expect(getSelectedDeviceListSpy).toHaveBeenCalled();
  });

  it('should call getUpdateType one time', () => {
    const getUpdateTypeSpy = spyOn(service, 'getUpdateType').and.callThrough();
    service.getUpdateType();
    expect(getUpdateTypeSpy).toHaveBeenCalled();
  });

  it('should call getSelectedFirmware one time', () => {
    const getSelectedFirmwareSpy = spyOn(service, 'getSelectedFirmware').and.callThrough();
    service.getSelectedFirmware();
    expect(getSelectedFirmwareSpy).toHaveBeenCalled();
  });

  it('should call getGroupId one time', () => {
    const getGroupIdSpy = spyOn(service, 'getGroupId').and.callThrough();
    service.getGroupId();
    expect(getGroupIdSpy).toHaveBeenCalled();
  });

  it('should call getPageType one time', () => {
    const getPageTypeSpy = spyOn(service, 'getPageType').and.callThrough();
    service.getPageType();
    expect(getPageTypeSpy).toHaveBeenCalled();
  });

  it('should call getVersionType one time', () => {
    const getVersionTypeSpy = spyOn(service, 'getVersionType').and.callThrough();
    service.getVersionType();
    expect(getVersionTypeSpy).toHaveBeenCalled();
  });

  it('should call updateDevicesFirmware one time', () => {
    const updateDevicesFirmwareSpy = spyOn(service, 'updateDevicesFirmware').and.callThrough();
    service.updateDevicesFirmware('sampleData');
    expect(updateDevicesFirmwareSpy).toHaveBeenCalled();
  });

  it('should call resetValues one time', () => {
    const resetValuesSpy = spyOn(service, 'resetValues').and.callThrough();
    service.resetValues();
    expect(resetValuesSpy).toHaveBeenCalled();
  });

  it('should call updateDevices one time', () => {
    const updateDevicesSpy = spyOn(service, 'updateDevices').and.callThrough();
    service.updateDevices('sampleParama');
    expect(updateDevicesSpy).toHaveBeenCalled();
  });

  it('should call updateDevices one time', () => {
    const getFirmwareHistoryDataSpy = spyOn(service, 'getFirmwareHistoryData').and.callThrough();
    service.getFirmwareHistoryData('params', '0491624061ac');
    expect(getFirmwareHistoryDataSpy).toHaveBeenCalled();
  });

  it('should call updateGroupWithSelectedFirmware one time', () => {
    const updateGroupWithSelectedFirmwareSpy = spyOn(service, 'updateGroupWithSelectedFirmware').and.callThrough();
    service.updateGroupWithSelectedFirmware('sampledata', 'sampledata');
    expect(updateGroupWithSelectedFirmwareSpy).toHaveBeenCalled();
  });
});
