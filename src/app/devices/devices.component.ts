import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { DeviceService } from './device.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseService } from '../base-service.service';
import { BaseComponent } from '../base-component.component';
import { Device, DeviceListResponse } from '../shared/models/device.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  DeviceGroups,
  DeviceGroupsResponse,
} from '../shared/models/deviceGroups.model';
import {
  UpdateType,
  UpdateContentType,
} from '../../app/shared/models/update.type';
import { FirmwareService } from '../../app/firmware/firmware.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ConfigurationService } from '../configuration/configuration.service';
import { Configurations, ConfigurationsResponse } from '../shared/models/configuration.model';
import { AppPackageService } from '../shared/models/services/appPackages.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent extends BaseComponent
  implements OnInit, OnDestroy {
  @ViewChild('tabs') tabs;
  @ViewChild(ModalDirective, { static: false }) configuarationUpdateModal: ModalDirective;
  @ViewChild('deleteConfirmatopnModal', { static: false }) deleteConfirmatopnModal: ModalDirective;
  modalRef: BsModalRef;

  filter;
  devicesList: Device[];
  deviceGroups: DeviceGroups[];
  configDataGrid: any;
  configGroup: any;
  selcetedPageNum: any = 0;
  selcetedGroupPageNum: any = 0;
  sortDirection = 'ASC';
  itemsPerPage: any = 10;
  sortKeys = 'macid';
  noOfElements: number;
  noOfElementsGroup: number;
  devicesSelected = [];
  groupsSelected = [];
  searchTerm: any = '';
  searchField: any;
  groupSearchTerm: any;
  searchInField = 'serial';
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
    action_performed: false,
    date: false,
    time: false,
    perfomed_by: false,
    device_serial: false,
    date_filter: true
  };
  configurationForm: FormGroup;
  showMore = false;
  isInputDisabled = true;

  disableSearchFields = false;

  totalDeviceCount: number;

  showPopOverFlag: boolean;
  configValues: Configurations[];
  configValuesCopy: Configurations[];
  updateType: number;
  clearRowSelected = false;
  clearGroupsRowSelected = false;
  updatingDeviceValues;
  clearUpateType = false;
  diffDays: number;
  fromDate = '';
  toDate = '';
  userRoles;
  dateSelected = false;

  constructor(
    private deviceService: DeviceService,
    private baseService: BaseService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private firmwareService: FirmwareService,
    private configurationService: ConfigurationService,
    private appPackageService: AppPackageService,
    private toastrService: ToastrService
  ) {
    super();
    this.configDataGrid = {
      id: 'dataGridPagination',
      currentPage: 0,
      itemsPerPage: 10,
      totalItems: 0,
    };

    this.configGroup = {
      id: 'deviceGroupPagination',
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
    };
  }

  ngOnInit() {
    this.getDevices();
    this.getGroups();
    this.userRoles = JSON.parse(localStorage.getItem('userRoles'));
  }

  getDevices() {
    let params;
    if (this.searchTerm === '' && !this.dateSelected) {
      params = new HttpParams()
        .set('from', this.fromDate)
        .set('pageIndex', this.selcetedPageNum)
        .set('pageSize', this.configDataGrid.itemsPerPage)
        .set('sortDirection', this.sortDirection)
        .set('sortKeys', this.sortKeys)
        .set('to', this.toDate);

    } else if (this.dateSelected && this.searchTerm === '') {
      params = new HttpParams()
        .set('from', this.fromDate)
        .set('pageIndex', this.selcetedPageNum)
        .set('pageSize', this.configDataGrid.itemsPerPage)
        .set('sortDirection', this.sortDirection)
        .set('sortKeys', this.sortKeys)
        .set('search', 'enrolled_on')
        .set('to', this.toDate);
     } else {
      params = new HttpParams()
        .set('from', this.fromDate)
        .set('pageIndex', this.selcetedPageNum)
        .set('pageSize', this.configDataGrid.itemsPerPage)
        .set('sortDirection', this.sortDirection)
        .set('sortKeys', this.sortKeys)
        .set('search', this.searchInField)
        .set('searchTerm', this.searchTerm)
        .set('to', this.toDate);
    }

    const subscription = this.deviceService
      .getDevices(params)
      .subscribe((data: DeviceListResponse) => {
        this.devicesList = data.content;
        this.configDataGrid.totalItems = data.totalElements;
        this.totalDeviceCount = data.totalElements;
        this.configDataGrid.currentPage = data.number + 1;
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
          device.uptime_converted = this.deviceService.uptime_conversion(device.uptime);
          device.lastSeen = this.deviceService.epoc_time_conversion(device.lastSeen);
          device['assembly_serial'] = device['assembly_serial'] ? device['assembly_serial'].split('|')[3] : '';
        });

        this.dateSelected = false;
      });

    // adding the subscription to the {BaseComponent} to subscribe
    this.subscribers.push(subscription);
  }

  pageChanged(pageNumber: number) {
    this.selcetedPageNum = pageNumber - 1;
    this.getDevices();
    this.configDataGrid.currentPage = pageNumber;
  }

  selectedDevices(event) {
    this.devicesSelected = event;
  }

  selectedConfigFileds(event) {
    if (event.target.checked) {
      this.configurationForm.get(event.target.name).enable();
      this.isInputDisabled = false;
    } else {
      this.configurationForm.get(event.target.name).disable();
      this.isInputDisabled = true;
    }
  }

  searchDeviceList(searchString) {
    this.searchTerm = searchString;
    this.selcetedPageNum = 0;
    this.clearRowSelected = true;
    this.devicesSelected = [];
    this.getDevices();
  }
  createGroup() {
    this.router.navigate(['/createGroup'], { skipLocationChange: false });
  }

  selectField(fieldName) {
    this.searchInField = fieldName;
  }

  slectedGroupTab() {
    this.disableSearchFields = true;
  }

  slectedAllDevicesTab() {
    this.disableSearchFields = false;
  }

  getGroups() {
    const params = new HttpParams()
      .set('pageIndex', this.selcetedGroupPageNum)
      .set('pageSize', this.configGroup.itemsPerPage)
      .set('search', this.searchField)
      .set('searchTerm', this.groupSearchTerm);
    const subscription = this.deviceService
      .getDeviceGroups(params)
      .subscribe((data: DeviceGroupsResponse) => {
        this.deviceGroups = data.content;
        this.configGroup.totalItems = data.totalElements;
        this.noOfElementsGroup = data.numberOfElements;
        this.configGroup.currentPage = data.number + 1;
      });
    // adding the subscription to the {BaseComponent} to subscribe
    this.subscribers.push(subscription);
  }

  groupPageChanged(groupPageNumber: number) {
    this.selcetedGroupPageNum = groupPageNumber - 1;
    // this.router.navigate(['/devices'], { queryParams: { page: groupPageNumber }, skipLocationChange: true });
    this.getGroups();
    this.configGroup.currentPage = groupPageNumber;
  }

  selectedGroups(event) {
    this.groupsSelected = event;
  }

  searchDeviceGroups(groupSearchTerm) {
    this.groupSearchTerm = groupSearchTerm;
    this.searchField = 'name';
    this.selcetedGroupPageNum = 0;
    this.clearGroupsRowSelected = true;
    this.groupsSelected = [];
    this.getGroups();
  }
  showPopOver() {
    this.showPopOverFlag = true;
  }

  updateDevices(event) {
    switch (event.updateContentType) {
      case UpdateContentType.Apps:
        this.updatingDeviceValues = {
          updateType: event.updateType,
          devicesSelected: JSON.stringify(this.devicesSelected),
          totalDeviceCount: this.devicesSelected.length
        };
        if (event.updateType === UpdateType.Global) {
          this.updatingDeviceValues.totalDeviceCount = this.totalDeviceCount;
        }
        this.router.navigate(['/apppackages'], { queryParams: this.updatingDeviceValues });
        break;
      case UpdateContentType.Firmware:
        this.updatingDeviceValues = {
          updateType: event.updateType,
          devicesSelected: JSON.stringify(this.devicesSelected),
          totalDeviceCount: this.devicesSelected.length,
          pageName: 'devices'
        };
        if (event.updateType === UpdateType.Global) {
          this.updatingDeviceValues.totalDeviceCount = this.totalDeviceCount;
        }
        this.router.navigate(['/firmware'], { queryParams:  this.updatingDeviceValues });
        break;

      case UpdateContentType.Configuration:
        // placeholder for update configuration
        this.configurationService.setUpdateType(event.updateType);
        this.configurationService.setDevicesList(this.devicesSelected);
        if (event.updateType === UpdateType.Global) {
          this.configurationService.setDevicesCount(this.totalDeviceCount);
        }
        this.updateType = event.updateType;
        this.showConfigurationModal();
        break;
    }
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

  cancelChanges() {
    this.configuarationUpdateModal.hide();
    this.configurationService.resetValues();
  }

  updatedConfigValues(configValues) {
    configValues.forEach((config) => { delete config.disabled; });
    const values = {configuration: {
        configs: this.configValues },
        devices: this.devicesSelected
      };

    const globalValues = {configuration: {
      configs: this.configValues },
      devices: []
    };

    if (this.updateType === UpdateType.Global) {
      const updateGlobalConfigurationSubscription = this.configurationService.updateConfigValues(globalValues).subscribe(data => {
        this.toastrService.show(
          `<img src="../../assets/images/success.svg"  alt="icon">
           <span> &nbsp&nbsp&nbsp Global Level Configuration updated initiated </span>`,
          ' ',
          {
            enableHtml: true,
            titleClass: 'background',
            positionClass: 'toast-top-center',
          }
        );
        this.devicesSelected = [];
      });

      this.subscribers.push(updateGlobalConfigurationSubscription);
    } else {
      const updateConfigurationSubscription = this.configurationService.updateConfigValues(values).subscribe(data => {
        this.toastrService.show(
          `<img src="../../assets/images/success.svg"  alt="icon">
           <span> &nbsp&nbsp&nbsp Configuration updated initiated for ${this.devicesSelected.length} Device(s) </span>`,
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

    this.configuarationUpdateModal.hide();

    this.devicesSelected.forEach((value, key) =>  {
      value.checked = false;
    });
    this.clearRowSelected = true;
    this.clearUpateType = true;

  }

  changeBooleanValue() {
    this.clearRowSelected = false;
    this.configurationService.resetValues();
  }

  checkForEmptyString(searchString) {
    if (searchString === '') {
      this.searchTerm = searchString;
      this.selcetedPageNum = 0;
      this.clearRowSelected = true;
      this.getDevices();
    }
  }

  checkForEmptyStringGroups(searchString) {
    if (searchString === '') {
      this.groupSearchTerm = searchString;
      this.selcetedGroupPageNum = 0;
      this.clearGroupsRowSelected = true;
      this.getGroups();
    }
  }

  changeGroupBooleanValue() {
    this.clearGroupsRowSelected = false;
  }

  showDeleteConfirmationModal() {
    this.deleteConfirmatopnModal.show();
  }

  deleteGroup() {
    const deleteSubscription = this.deviceService
      .deleteMultipleGroup(this.groupsSelected)
      .subscribe((data) => {
        this.toastrService.show(
          '<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp Groups deleted successfully </span>',
          ' ',
          {
            enableHtml: true,
            titleClass: 'background',
            positionClass: 'toast-top-center',
          }
        );
        this.deleteConfirmatopnModal.hide();
        this.clearGroupsRowSelected = true;
        this.getGroups();
        this.groupsSelected = [];
      });
    this.subscribers.push(deleteSubscription);
    this.deleteConfirmatopnModal.hide();
  }

  selectedDates(event) {
    this.fromDate = event.from;
    this.toDate = event.to;
    this.sortDirection = event.sortDirection;
    this.dateSelected = true;
    this.selcetedPageNum = 0;
    this.clearRowSelected = true;
    this.devicesSelected = [];
    this.getDevices();
  }
}
