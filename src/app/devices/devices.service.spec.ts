import { TestBed } from '@angular/core/testing';

import { DeviceService } from './device.service';
import { DeviceListResponse } from '../shared/models/device.model';
import { HttpClientModule } from '@angular/common/http';
import { DeviceGroupsResponse } from '../shared/models/deviceGroups.model';
import { devicesList, groupList, deviceDetails, groupDetails } from 'src/data/mockData/devicesAndGroups';
import { ToastrModule } from 'ngx-toastr';

describe('DeviceService', () => {
  let service: DeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        }),
      ],
      providers: [
        DeviceService
      ]
    });
    service = TestBed.inject(DeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getDevices should give back list of devices', () => {
    spyOn(service, 'getDevices').and.callThrough();
    service.getDevices();
    expect(service.getDevices).toHaveBeenCalled();
  });

  it('getUnassignedDevices should give back list of unassigned devices', () => {
    spyOn(service, 'getUnassignedDevices').and.callThrough();
    service.getUnassignedDevices();
    expect(service.getUnassignedDevices).toHaveBeenCalled();
  });

  it('getDeviceDetails', () => {
    spyOn(service, 'getDeviceDetails').and.callThrough();
    service.getDeviceDetails('sampleId');
    expect(service.getDeviceDetails).toHaveBeenCalled();
  });

  it('getDeviceGroups', () => {
    spyOn(service, 'getDeviceGroups').and.callThrough();
    service.getDeviceGroups();
    expect(service.getDeviceGroups).toHaveBeenCalled();
  });

  it('updateExistingDevice', () => {
    spyOn(service, 'updateExistingDevice').and.callThrough();
    service.updateExistingDevice('sampleId', 'data');
    expect(service.updateExistingDevice).toHaveBeenCalled();
  });

  it('deleteGroup', () => {
    spyOn(service, 'deleteGroup').and.callThrough();
    service.deleteGroup('groupName');
    expect(service.deleteGroup).toHaveBeenCalled();
  });

  it('createNewGroup', () => {
    spyOn(service, 'createNewGroup').and.callThrough();
    service.createNewGroup('data');
    expect(service.createNewGroup).toHaveBeenCalled();
  });

  it('addDevicesToGroup', () => {
    spyOn(service, 'addDevicesToGroup').and.callThrough();
    service.addDevicesToGroup('deviceGroup', 'devices');
    expect(service.addDevicesToGroup).toHaveBeenCalled();
  });

  it('getGroupNames', () => {
    spyOn(service, 'getGroupNames').and.callThrough();
    service.getGroupNames();
    expect(service.getGroupNames).toHaveBeenCalled();
  });

  it('getUpdateHistoryData', () => {
    spyOn(service, 'getUpdateHistoryData').and.callThrough();
    service.getUpdateHistoryData('serial', 'params');
    expect(service.getUpdateHistoryData).toHaveBeenCalled();
  });

  it('getConfigHistoryData', () => {
    spyOn(service, 'getConfigHistoryData').and.callThrough();
    service.getConfigHistoryData('serial', 'params');
    expect(service.getConfigHistoryData).toHaveBeenCalled();
  });

  it('getDeviceListInAGroup', () => {
    spyOn(service, 'getDeviceListInAGroup').and.callThrough();
    service.getDeviceListInAGroup('id');
    expect(service.getDeviceListInAGroup).toHaveBeenCalled();
  });

  it('updateGroupData', () => {
    spyOn(service, 'updateGroupData').and.callThrough();
    service.updateGroupData('groupDetails', 'deviceGroup');
    expect(service.updateGroupData).toHaveBeenCalled();
  });

  it('getGroupDetailsByGroupId', () => {
    spyOn(service, 'getGroupDetailsByGroupId').and.callThrough();
    service.getGroupDetailsByGroupId('groupId');
    expect(service.getGroupDetailsByGroupId).toHaveBeenCalled();
  });

  it('getGroupDevicesByGroupId', () => {
    spyOn(service, 'getGroupDevicesByGroupId').and.callThrough();
    service.getGroupDevicesByGroupId('groupId', 'params');
    expect(service.getGroupDevicesByGroupId).toHaveBeenCalled();
  });

  it('getEligibleDeviceForSoftwarePackageId', () => {
    spyOn(service, 'getEligibleDeviceForSoftwarePackageId').and.callThrough();
    service.getEligibleDeviceForSoftwarePackageId('groupId', 'params');
    expect(service.getEligibleDeviceForSoftwarePackageId).toHaveBeenCalled();
  });

  it('removeDevicesFromGroup', () => {
    spyOn(service, 'removeDevicesFromGroup').and.callThrough();
    service.removeDevicesFromGroup('Id', 'devices');
    expect(service.removeDevicesFromGroup).toHaveBeenCalled();
  });

  it('getMetrics', () => {
    spyOn(service, 'getMetrics').and.callThrough();
    service.getMetrics();
    expect(service.getMetrics).toHaveBeenCalled();
  });

  it('deleteMultipleGroup', () => {
    spyOn(service, 'deleteMultipleGroup').and.callThrough();
    service.deleteMultipleGroup('groups');
    expect(service.deleteMultipleGroup).toHaveBeenCalled();
  });

  it('getDevicesBystatus', () => {
    spyOn(service, 'getDevicesBystatus').and.callThrough();
    service.getDevicesBystatus('status');
    expect(service.getDevicesBystatus).toHaveBeenCalled();
  });

  it('restartDevice', () => {
    spyOn(service, 'restartDevice').and.callThrough();
    service.restartDevice('deviceSerial');
    expect(service.restartDevice).toHaveBeenCalled();
  });
});
