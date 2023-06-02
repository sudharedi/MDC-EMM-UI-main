import { Injectable } from '@angular/core';
import { BaseService } from '../base-service.service';
import { Observable } from 'rxjs';
import { urlList } from '../urlListConstants';
import { Device } from '../shared/models/device.model';

@Injectable({
  providedIn: 'root',
})
export class FirmwareService {
  private selectedDevices: Device[] = [];
  private updateType: number | null;
  private devicesCount: number | null;
  /* pkadiyala:  To-do*
    as of now defined any, once model defined for firmware update the model*/
  private selectedFirmware: any | null;
  private groupId;
  private pageType;
  private updateVersion: string;
  constructor(private baseService: BaseService) { }
  updateDevices(params): Observable<any> {
    return this.baseService.get(params);
  }

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

  setSelectedFirmware(firmware: any) {
    this.selectedFirmware = firmware;
  }
  setGroupId(id) {
    this.groupId = id;
  }
  setPageType(pagetype) {
    this.pageType = pagetype;
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

  getSelectedFirmware(): any {
    return this.selectedFirmware;
  }
  getGroupId() {
    return this.groupId;
  }
  getPageType() {
    return this.pageType;
  }
  getVersionType() {
    return this.updateVersion ;
  }
  updateDevicesFirmware(data) {
    return this.baseService.post(urlList.UPDATE_FIRMWARE_FOR_DEVICE, data);
  }

  resetValues() {
    this.updateType = null;
    this.selectedDevices = [];
    this.selectedFirmware = null;
    this.devicesCount = null;
    this.updateVersion = null;
  }

  fectAll(): Observable<any> {
    return this.baseService.get(urlList.GET_FIRMWARE_List);
  }

  getFirmwareHistoryData(params, serial): Observable<any> {
    return this.baseService.get(`/devices/${serial}/history/firmware` + '?' + params);
  }
  updateGroupWithSelectedFirmware(deviceGroupId, data): Observable<any> {
    return this.baseService.post(`/groups/${deviceGroupId}/firmware`, data);
  }
  cancelFirmwareInstallationForPendingStatus(deviceSerial, jobId): Observable<any> {
    return this.baseService.delete(`/devices/${deviceSerial}/firmwares/pending/${jobId}`);
  }
}
