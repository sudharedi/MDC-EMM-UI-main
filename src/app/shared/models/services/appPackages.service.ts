import { Injectable } from '@angular/core';
import { BaseService } from '../../../base-service.service';
import { Observable } from 'rxjs';
import { urlList } from '../../../urlListConstants';
import { InstalledApps } from '../../models/device.model';
import { Device } from '../../models/device.model';


@Injectable({
  providedIn: 'root'
})
export class AppPackageService {
  public selectedDevices: Device[] = [];
  public updateType: number | null;
  public devicesCount: number | null;
  public selectedAppPackage: any | null;
  public nonCompatibleDeviceList: Device[] = [];
  public groupId;
  public updateVersion: string;
  constructor(private baseService: BaseService) { }

  setUpdateType(val: number) {
    this.updateType = val;
  }
  setDevicesList(deviceArr: Device[]) {
    this.selectedDevices = deviceArr;
    this.devicesCount = deviceArr.length;
  }

  setDevicesCount(count: number) {
    this.devicesCount = count;
  }

  setSelectedAppPackage(appPackage: any) {
    this.selectedAppPackage = appPackage;
  }
  setNonCompatibleDeviceList(deviceArr) {
    localStorage.setItem('data', JSON.stringify(deviceArr));
  }
  setGroupId(id) {
    this.groupId = id;
  }
  setVersionType(name) {
    this.updateVersion = name;
  }
  getSelectedDevicesCount(): number | null {
    return this.devicesCount;
  }

  getSelectedDeviceList(): Device[] {
    return this.selectedDevices;
  }
  getUpdateType(): number | null {
    return this.updateType;
  }

  getSelectedAppPackage() {
    return this.selectedAppPackage;
  }
  getNonCompatibleDeviceList() {
    return this.nonCompatibleDeviceList;
  }
  getGroupId() {
    return this.groupId;
  }
  getVersionType() {
    return this.updateVersion;
  }
  resetValues() {
    this.updateType = null;
    this.selectedDevices = [];
    this.devicesCount = null;
    this.selectedAppPackage = null;
    this.updateVersion = null;
  }
  fectAll(params?): Observable<InstalledApps> {
    return this.baseService.get(urlList.GET_APP_PACKAGE_LIST);
  }
  updateDevicesApp(data): Observable<any> {
    return this.baseService.post(urlList.UPDATE_SOFTWARE_PACKAGE_FOR_DEVICE, data);
  }
  unInstallAppPackage(data): Observable<any> {
    return this.baseService.delete(urlList.UPDATE_SOFTWARE_PACKAGE_FOR_DEVICE, data);
  }
  updateGroupAppPackages(deviceGroupId, data): Observable<any> {
    return this.baseService.post(`/groups/${deviceGroupId}/softwarepackage`, data);
  }
  cancelAppPackageInstallationForPendingStatus(deviceSerial, jobId): Observable<any> {
    return this.baseService.delete(`/devices/${deviceSerial}/softwarepackages/pending/${jobId}`);
  }

}
