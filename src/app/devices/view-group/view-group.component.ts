import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DeviceService } from '../device.service';
import { DeviceListResponse, Device } from 'src/app/shared/models/device.model';
import { HttpParams } from '@angular/common/http';
import { BaseComponent } from '../../base-component.component';
import {
  UpdateType,
  UpdateContentType,
} from 'src/app/shared/models/update.type';
import { FirmwareService } from 'src/app/firmware/firmware.service';
import { ConfigurationService } from 'src/app/configuration/configuration.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ConfigurationsResponse, Configurations } from 'src/app/shared/models/configuration.model';
import { AppPackageService } from '../../shared/models/services/appPackages.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.scss'],
})
export class ViewGroupComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('configuarationUpdateModal') configuarationUpdateModal: ModalDirective;

  selctedGroup;
  devicesList: Device[];
  deviceGroupConfig: any;
  selcetedPageNum: any = 0;
  sortDirection = 'ASC';
  itemsPerPage: any = 10;
  sortKeys = 'macid';
  noOfElements: number;
  devicesSelected = [];
  showPagination: boolean;
  showPopOverFlag: boolean;
  totalDeviceCount: number;
  updateType: number;
  selectedGroup;
  configValues: Configurations[];
  configValuesCopy: Configurations[];
  tableColumnHeaders = {
    checkboxSelection: true,
    macid: true,
    alias: true,
    customer: true,
    group: true,
    enrolled_on: true,
    location: true,
    assembly_serial: true,
    status: true,
    uptime: true,
    warning: true,
    action: true,
    serial: true,
    simiccid: true,
    cradlepoint_id: true,
    last_heard: true,
  };
  clearRowSelected = false;
  updatingDeviceValuesOfGroup;
  clearUpateType = false;
  diffDays: number;
  userRoles;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private deviceService: DeviceService,
      private firmwareService: FirmwareService,
      private configurationService: ConfigurationService,
      private appPackageService: AppPackageService,
      private toastrService: ToastrService
     ) {
    super();
    this.deviceGroupConfig = {
      id: 'dataGridPagination',
      currentPage: 0,
      itemsPerPage: 10,
      totalItems: 0,
    };
  }
  ngOnInit(): void {
    this.route.params.subscribe((group: Params) => {
      this.selectedGroup = group;
    });

    this.getDevices();
    this.getGroupDetails();
    this.userRoles = JSON.parse(localStorage.getItem('userRoles'));
  }
  getGroupDetails() {
    const groupDetailsSubscription = this.deviceService
      .getGroupDetailsByGroupId(this.selectedGroup.groupId)
      .subscribe((response: any) => {
        this.selctedGroup = response.name;
      });
    this.subscribers.push(groupDetailsSubscription);
  }


  getDevices() {
    const params = new HttpParams()
      .set('pageIndex', this.selcetedPageNum)
      .set('pageSize', this.deviceGroupConfig.itemsPerPage)
      .set('sortDirection', this.sortDirection)
      .set('sortKeys', this.sortKeys);

    const subscription = this.deviceService
      .getGroupDevicesByGroupId(this.selectedGroup.groupId, params)
      .subscribe((data: DeviceListResponse) => {
        this.devicesList = data.content;
        this.deviceGroupConfig.totalItems = data.totalElements;
        this.totalDeviceCount = data.totalElements;
        this.deviceGroupConfig.currentPage = data.number + 1;
        this.noOfElements = data.numberOfElements;

        for (const row of this.devicesSelected) {
          for (const device of this.devicesList) {
            if (row === device.macid) {
              device.checked = true;
            }
          }
        }

        this.devicesList.forEach(device => {
          const date1 = new Date().getTime();
          const date2 = new Date(device.certificate?.expiresOn).getTime();
          device.diffDays = Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24));
          device.lastSeen = this.deviceService.epoc_time_conversion(device.lastSeen);
          device['assembly_serial'] = device['assembly_serial'] ? device['assembly_serial'].split('|')[3] : '';
        });
      });
    this.subscribers.push(subscription);
  }

  pageChanged(pageNumber: number) {
    this.selcetedPageNum = pageNumber - 1;
    this.getDevices();
    this.deviceGroupConfig.currentPage = pageNumber;
  }

  selectedDevices(event) {
    this.devicesSelected = event;
  }

  editGroup() {
    this.router.navigate(['/editGroup', this.selectedGroup.groupId], {
      skipLocationChange: false,
    });
  }

  updateDevices(event) {
    switch (event.updateContentType) {
      case UpdateContentType.Apps:
        this.updatingDeviceValuesOfGroup = {
          updateType: event.updateType,
          devicesSelected: JSON.stringify(this.devicesSelected),
          totalDeviceCount: this.devicesSelected.length,
          groupId: this.selectedGroup.groupId,
          numberOfDevicesInAGroup: this.devicesList.length
        };
        this.appPackageService.setGroupId(this.selectedGroup.groupId);
        if (event.updateType === UpdateType.Group) {
          this.updatingDeviceValuesOfGroup.totalDeviceCount = this.totalDeviceCount;
        }
        this.router.navigate(['/apppackages'], { queryParams: this.updatingDeviceValuesOfGroup, skipLocationChange: false });
        break;
      case UpdateContentType.Firmware:
        this.updatingDeviceValuesOfGroup = {
          updateType: event.updateType,
          devicesSelected: JSON.stringify(this.devicesSelected),
          totalDeviceCount: this.devicesSelected.length,
          groupId: this.selectedGroup.groupId,
          numberOfDevicesInAGroup: this.devicesList.length,
          pageType: 'groupDetails'
        };
        if (event.updateType === UpdateType.Group) {
          this.updatingDeviceValuesOfGroup.totalDeviceCount = this.totalDeviceCount;
        }
        this.router.navigate(['/firmware'], { queryParams: this.updatingDeviceValuesOfGroup, skipLocationChange: false });
        break;

      case UpdateContentType.Configuration:
        // placeholder for update configuration
        this.configurationService.setUpdateType(event.updateType);
        this.configurationService.setDevicesList(this.devicesSelected);
        if (event.updateType === UpdateType.Group) {
          this.configurationService.setDevicesCount(this.totalDeviceCount);
        }
        this.updateType = event.updateType;
        this.showConfigurationModal();
        break;
    }

  }

  showPopOver() {
    this.showPopOverFlag = true;
  }

  showConfigurationModal() {
    if (this.devicesSelected.length === 1) {
      const id = this.devicesSelected[0].serial;
      const subscription = this.configurationService.getConfigValues(id).subscribe((data: ConfigurationsResponse) => {
       this.configValues = data.configs;
       this.configValues.forEach(value => {
         value.disabled = true;
       });
       this.configValuesCopy = JSON.parse(JSON.stringify(this.configValues));
       this.configuarationUpdateModal.show();
      });
      // adding the subscription to the {BaseComponent} to subscribe
      this.subscribers.push(subscription);
    } else {
      const subscription = this.configurationService.getDefaultConfigValues().subscribe((data: ConfigurationsResponse) => {
        this.configValues = data.configs;
        this.configValues.forEach(value => {
          value.disabled = true;
        });
        this.configValuesCopy = JSON.parse(JSON.stringify(this.configValues));
        this.configuarationUpdateModal.show();
       });
       // adding the subscription to the {BaseComponent} to subscribe
      this.subscribers.push(subscription);
    }
  }

  cancelConfigChanges() {
    this.configuarationUpdateModal.hide();
  }

  updatedConfigValues(configValues) {
    configValues.forEach((config) => {
        delete config.disabled;
    });
    const values = {
      configuration: {
        configs: this.configValues },
        devices: this.devicesSelected
      };

    const groupLevelUpdate = {
      configuration: {
        configs: this.configValues
      }
    };

    if (this.updateType === UpdateType.Group) {
      // tslint:disable-next-line:max-line-length
      const updateGroupConfigurationSubscription = this.configurationService.updateGroupsConfigValues(this.selectedGroup.groupId, groupLevelUpdate).subscribe(data => {
        this.toastrService.show(
          `<img src="../../assets/images/success.svg"  alt="icon">
              <span> &nbsp&nbsp&nbsp Configuration updated initiated for
              ${this.totalDeviceCount} device(s) </span>`,
          ' ',
          {
            enableHtml: true,
            titleClass: 'background',
            positionClass: 'toast-top-center',
          }
        );
        this.devicesSelected = [];
      });

      this.subscribers.push(updateGroupConfigurationSubscription);

    } else {
      const updateConfigurationSubscription = this.configurationService.updateConfigValues(values).subscribe(data => {
        this.toastrService.show(
          `<img src="../../assets/images/success.svg"  alt="icon">
              <span> &nbsp&nbsp&nbsp Configuration update initiated for
              ${this.devicesSelected.length} device </span>`,
          ' ',
          {
            enableHtml: true,
            titleClass: 'background',
            positionClass: 'toast-top-center',
          }
        );
        this.devicesSelected = [];

      });

      this.subscribers.push(updateConfigurationSubscription);

     }

    this.devicesSelected.forEach((value, key) => {
      value.checked = false;
    });

    this.configuarationUpdateModal.hide();
    this.clearRowSelected = true;
    this.clearUpateType = true;
  }

  changeBooleanValue() {
    this.clearRowSelected = false;
    this.configurationService.resetValues();
  }

}
