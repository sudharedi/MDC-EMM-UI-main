import { TestBed, async } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { configurationValues } from 'src/data/mockData/configuration';
import { ConfigurationsResponse } from '../shared/models/configuration.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { UpdateType } from '../shared/models/update.type';
import { devicesListGrid } from 'src/data/mockData/devicesAndGroups';


describe('ConfigurationService', () => {
  let service: ConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
          imports: [
            HttpClientModule,
            HttpClientTestingModule,
            ToastrModule.forRoot({
              preventDuplicates: true
            }),
            RouterTestingModule
          ],
            providers: [
              ConfigurationService
          ]
    });
    service = TestBed.inject(ConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('on getConfigValues should get list of configs', () => {
    spyOn(service, 'getConfigValues').and.callThrough();
    service.getConfigValues('device');
    expect(service.getConfigValues).toHaveBeenCalled();
  });

  it('on getDefaultConfigValues should get list of default configs back', () => {
    spyOn(service, 'getDefaultConfigValues').and.callThrough();
    service.getDefaultConfigValues();
    expect(service.getDefaultConfigValues).toHaveBeenCalled();
  });

  it('on updateConfigValues should send values to api', () => {
    spyOn(service, 'updateConfigValues').and.callThrough();
    service.updateConfigValues('data');
    expect(service.updateConfigValues).toHaveBeenCalled();
  });

  it('updateGroupsConfigValues', () => {
    spyOn(service, 'updateGroupsConfigValues').and.callThrough();
    service.updateGroupsConfigValues('id', 'data');
    expect(service.updateGroupsConfigValues).toHaveBeenCalled();
  });

  it('on setUpdateType should set updateType in service', () => {
    spyOn(service, 'setUpdateType').and.callThrough();
    service.setUpdateType(5);
    expect(service.setUpdateType).toHaveBeenCalled();
    expect(service.updateType).toBe(5);
  });

  it('on setDevicesCount should set devicesCount value', () => {
    spyOn(service, 'setDevicesCount').and.callThrough();
    service.setDevicesCount(5);
    expect(service.setDevicesCount).toHaveBeenCalled();
    expect(service.devicesCount).toBe(5);
  });

  it('getSelectedDevicesCount', () => {
    spyOn(service, 'getSelectedDevicesCount').and.callThrough();
    service.getSelectedDevicesCount();
    expect(service.getSelectedDevicesCount).toHaveBeenCalled();
  });

  it('getSelectedDeviceList', () => {
    spyOn(service, 'getSelectedDeviceList').and.callThrough();
    service.getSelectedDeviceList();
    expect(service.getSelectedDeviceList).toHaveBeenCalled();
  });

  it('getUpdateType', () => {
    spyOn(service, 'getUpdateType').and.callThrough();
    service.getUpdateType();
    expect(service.getUpdateType).toHaveBeenCalled();
  });

  it('on resetValues following should happen', () => {
    spyOn(service, 'resetValues').and.callThrough();
    service.resetValues();
    expect(service.resetValues).toHaveBeenCalled();
    expect(service.updateType).toBe(null);
    expect(service.selectedDevices).toEqual([]);
    expect(service.devicesCount).toBe(null);
  });

  it('setDevicesList', () => {
    spyOn(service, 'setDevicesList').and.callThrough();
    service.setDevicesList(devicesListGrid);
    expect(service.setDevicesList).toHaveBeenCalled();
  });
});
