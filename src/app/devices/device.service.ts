import { Injectable } from '@angular/core';
import { BaseService } from '../base-service.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { urlList } from '../urlListConstants';
import { DeviceListResponse } from '../shared/models/device.model';
import { DeviceGroupsResponse } from '../shared/models/deviceGroups.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private baseService: BaseService) { }

  getDevices(params?): Observable<DeviceListResponse> {
    return this.baseService.get(urlList.GET_DEVICE_LIST + '?' +  params);
  }
  getUnassignedDevices(params?): Observable<DeviceListResponse> {
    return this.baseService.get(
      urlList.GET_DEVICE_LIST_UNASSIGNED + '?' + params
    );
  }

  getDeviceDetails(id): Observable<DeviceListResponse> {
  // return this.baseService.get(urlList.BASEURL + urlList.GET_DEVICE_LIST_BYID);
   return this.baseService.get(urlList.GET_DEVICE_LIST + '/' + id);
  }

  getDeviceGroups(params?): Observable<DeviceGroupsResponse> {
    return this.baseService.get(urlList.GET_DEVICE_GROUPS + '?' +  params);
  }

  updateExistingDevice(id, data): Observable<any> {
    return this.baseService.patch(urlList.GET_DEVICE_LIST + '/' + id, data);
  }

  deleteGroup(groupName): Observable<any> {
    return this.baseService.delete(urlList.GET_DEVICE_GROUPS + '/' +  groupName);
  }
  createNewGroup(data): Observable<any> {
    return this.baseService.post(urlList.CREATE_GROUP, data);
  }
  addDevicesToGroup(deviceGroup, devices): Observable<any> {
    return this.baseService.post(
      `/groups/${deviceGroup}/devices`,
      devices
    );
  }

  getGroupNames(): Observable<any> {
    return this.baseService.get(urlList.GET_GROUPS_NAMES);
  }


  getUpdateHistoryData(params, serial): Observable<any> {
    return this.baseService.get(`/devices/${serial}/history/software` + '?' +  params);
  }
  getDeviceHistoryData(params, serial): Observable<any> {
    return this.baseService.get(`/devices/${serial}/history/dispensers` + '?' +  params);
  }
  getConfigHistoryData(params, serial): Observable<any> {
    return this.baseService.get(`/devices/${serial}/history/configuration` + '?' +  params);
  }
  getDeviceListInAGroup(groupId) {
    return this.baseService.get(
      `/groups/${groupId}/devices`
    );
  }
  updateGroupData(deviceGroup, groupDetails ): Observable<any> {
    return this.baseService.patch(
      `/groups/${deviceGroup}`,
      groupDetails
    );
  }
  getGroupDetailsByGroupId(groupId) {
    return this.baseService.get(`/groups/${groupId}`);
  }

  getGroupDevicesByGroupId(groupId, params) {
    return this.baseService.get(`/groups/${groupId}/devices` + '?' + params);
  }
  getEligibleDeviceForSoftwarePackageId(packageId, params?): Observable<DeviceListResponse> {
    return this.baseService.get(`/softwarepackages/${packageId}/devices` + '?' + params);
  }

  removeDevicesFromGroup(deviceGroupId, devices) {
    return this.baseService.delete(
      `/groups/${deviceGroupId}/devices`,
      devices
    );
  }

  getMetrics() {
    return this.baseService.get(urlList.GET_METRICS);
  }

  deleteMultipleGroup(groups): Observable<any> {
    return this.baseService.delete(urlList.DELETE_MULTIPLE_GROUPS, groups);
  }

  getDevicesBystatus(status) {
    return this.baseService.get(`/dashboard/metrics/${status}`);
  }

  restartDevice(deviceSerial) {
    return this.baseService.post(`/devices/${deviceSerial}/reboot`, '');
  }

  getCurrentUser() {
    return this.baseService.getUser(urlList.BASEURL + `/profile/me`);
  }

  getRole() {
    return this.baseService.getUser(environment.cognitoLogin.tabs_url);
  }

  getKibanaUrl() {
    return this.baseService.get(`/dashboard/configs`);

  }

  uptime_conversion(uptime) {
    let totalSeconds = uptime;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let uptime_converted = hours + ":" + minutes + ":" + seconds;
    return uptime_converted;
  }

  epoc_time_conversion(time) {
    let time_converted;
    time_converted =new Date(parseInt(time)).toLocaleString('en-GB');
    time_converted = time_converted.replace(/[/]/g, "-");
    time_converted = time_converted.replace(/,/g, "");
    time_converted= this.swap_date_with_month_conversion(time_converted, '-');
    return time_converted;
  }

  swap_date_with_month_conversion(dateString, seperator) {
    let dateStringArray = dateString.split(seperator);
    if(dateStringArray.length < 2){
      return 'NA';
    }
    const newFormattedDateArray = [];
    // swap date and month
    newFormattedDateArray[0] = dateStringArray[1];
    newFormattedDateArray[1] = dateStringArray[0];
    for(var i = 2; i < dateStringArray.length; ++i){
      newFormattedDateArray.push(dateStringArray[i]);
    }
    return newFormattedDateArray.join(seperator);
  }

  
  getDeviceFaultsData(serial, params): Observable<any> {
    return this.baseService.get(`/devices/${serial}/faults` + '?' +  params);
  }

  getDeviceLogsData(serial, params): Observable<any> {
    return this.baseService.get(`/devices/${serial}/logs` + '?' +  params);
  }

  downloadDeviceLogs(serial, params) {
    return this.baseService.downloadCSV(`/devices/${serial}/logs/export-csv` + '?' + params);
  }

  downloadDeviceFaults(serial, params) {
    return this.baseService.downloadCSV(`/devices/${serial}/faults/export-csv` + '?' + params);
  }

  getGridPreferences(id) {
    return this.baseService.get(`/profile/preferences/` + id);
  }

  saveGridPreferences(id, gridPreferencesArray) {
    return this.baseService.post(`/profile/preferences/` + id, gridPreferencesArray);
  }
}
