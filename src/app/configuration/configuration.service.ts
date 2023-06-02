import { Injectable } from '@angular/core';
import { BaseService } from '../base-service.service';
import { Observable } from 'rxjs';
import { urlList } from '../urlListConstants';
import { ConfigurationsResponse} from '../shared/models/configuration.model';
import { Device } from '../shared/models/device.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  public selectedDevices: Device[] = [];
  public updateType: number | null;
  public devicesCount: number | null;

  constructor(private baseService: BaseService) { }

  getConfigValues(device): Observable<ConfigurationsResponse> {
    return this.baseService.get(`/devices/${device}/configurations`);
  }

  getDefaultConfigValues(): Observable<ConfigurationsResponse> {
    return this.baseService.get(urlList.GET_DEFAULT_CONFIGS);
  }

  updateConfigValues(data): Observable<any> {
    return this.baseService.patch(urlList.UPDATE_CONFIG, data);
  }

  updateGroupsConfigValues(groupId, data): Observable<any> {
    return this.baseService.patch(`/groups/${groupId}/configurations`, data);
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

  getSelectedDevicesCount(): number | null {
    return this.devicesCount;
  }

  getSelectedDeviceList(): Device[] {
    return this.selectedDevices;
  }
  getUpdateType(): number | null {
    return this.updateType;
  }

  resetValues() {
    this.updateType = null;
    this.selectedDevices = [];
    this.devicesCount = null;
  }


}
