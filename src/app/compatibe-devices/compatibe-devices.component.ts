import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base-component.component';
import { HttpParams } from '@angular/common/http';
import { DeviceService } from '../devices/device.service';
import { DeviceListResponse } from '../shared/models/device.model';
import { AppPackageService } from '../shared/models/services/appPackages.service';
import { FirmwareService } from '../firmware/firmware.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-compatibe-devices',
  templateUrl: './compatibe-devices.component.html',
  styleUrls: ['./compatibe-devices.component.scss']
})
export class CompatibeDevicesComponent extends BaseComponent implements OnInit {
  @ViewChild('updateDeviceAppModal') updateDeviceAppModal: ModalDirective;
  @ViewChild('updateDeviceFirmwareModal') updateDeviceFirmwareModal: ModalDirective;


  devicesList = [];

  /* grid configuration options */
  configDataGrid: any;
  noOfElements: number;
  softwarePackageId;
  tableColumnHeaders = {
    checkboxSelection: true,
    serial: false,
    macid: true,
    customer: false,
    group: true,
    enrolled_on: true,
    location: true,
    status: true,
    uptime: true,
    warning: false,
    action: false,
    simiccid: false,
    cradlepoint_id: false,
    last_heard: false,
    alias: true
  };

  configGroup: any;
  totalDeviceCount: number;

  selcetedPageNum: any = 0;
  sortDirection = 'ASC';
  itemsPerPage: any = 10;
  sortKeys = 'macid';
  noOfElementsGroup: number;
  groupsSelected = [];
  searchTerm: any;
  devicesSelected = [];
  devicesSelectedForUpdate;
  restartDevice: false;
  selectedPackageName;
  updateType;
  appVersion = '';
  firmwareVersion = '';
  deviceSelectedForFirmwareUpdate;
  appPackage;
  firmwarePackage;
  userRoles;

  constructor(
    private deviceService: DeviceService,
    private appPackageService: AppPackageService,
    private toastrService: ToastrService,
    private firmwareService: FirmwareService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
    this.configDataGrid = {
      id: 'dataGridPagination',
      currentPage: 0,
      itemsPerPage: 10,
      totalItems: 0,
    };
  }

  ngOnInit(): void {
    this.userRoles = JSON.parse(localStorage.getItem('userRoles'));
    this.appVersion = this.route.snapshot.queryParamMap.get('versionType');
    this.appPackage = JSON.parse(this.route.snapshot.queryParamMap.get('selectedAppPackage'));
    this.firmwareVersion = this.route.snapshot.queryParamMap.get('version');
    this.firmwarePackage = JSON.parse(this.route.snapshot.queryParamMap.get('selectedFirmware'));
    if (this.appVersion === 'appUpdate') {
      this.getSelectedAppPackage();
      this.getCompatibleDeviceList();
    } else if (this.firmwareVersion === 'firmwareUpdate') {
      this.getDeviceList();
      this.getSelectedFirmware();
    }
    this.restartDevice = false;
  }

  getDeviceList() {
    const params = new HttpParams()
      .set('pageIndex', this.selcetedPageNum)
      .set('pageSize', this.configDataGrid.itemsPerPage)
      .set('sortDirection', this.sortDirection)
      .set('sortKeys', this.sortKeys)
      .set('searchTerm', this.searchTerm);
    const subscription = this.deviceService
      .getDevices(params)
      .subscribe((data: DeviceListResponse) => {
        this.devicesList = data.content;
        this.configDataGrid.totalItems = data.totalElements;
        this.totalDeviceCount = data.totalElements;
        this.configDataGrid.currentPage = data.number + 1;
        this.noOfElements = data.numberOfElements;
      });
    this.subscribers.push(subscription);
  }
  getCompatibleDeviceList() {
    const params = new HttpParams()
      .set('pageIndex', this.selcetedPageNum)
      .set('pageSize', this.configDataGrid.itemsPerPage)
      .set('softwarePackageId ', this.softwarePackageId);
    const subscription = this.deviceService
      .getEligibleDeviceForSoftwarePackageId(this.softwarePackageId, params)
      .subscribe((data: DeviceListResponse) => {
        this.devicesList = data.content;
        this.configDataGrid.totalItems = data.totalElements;
        this.totalDeviceCount = data.totalElements;
        this.configDataGrid.currentPage = data.number + 1;
        this.noOfElements = data.numberOfElements;
      });
    this.subscribers.push(subscription);
  }

  pageChanged(pageNumber: number) {
    this.selcetedPageNum = pageNumber - 1;
    this.getDeviceList();
    this.configDataGrid.currentPage = pageNumber;
  }
  getSelectedAppPackage() {
    this.softwarePackageId = this.appPackage?.id;
    this.selectedPackageName = this.appPackage?.systemPackage ? this.appPackage?.packageVersion : this.appPackage?.packageName;
  }
  getSelectedFirmware() {
    this.selectedPackageName = this.firmwarePackage?.firmwareVersion;
  }
  updateAll() {
    this.devicesSelectedForUpdate = {
      devices: [],
      force: true,
      restart: false,
      softwarePackageId: this.softwarePackageId
    };
    this.updateDeviceApp();
  }
  update() {
    this.updateDeviceAppModal.show();
  }
  updateAppPackageForSelectedDevice() {
    this.devicesSelectedForUpdate = {
      devices: this.devicesSelected,
      force: true,
      restart: this.restartDevice,
      softwarePackageId: this.softwarePackageId
    };
    this.updateDeviceApp();
  }
  closePopUp() {
    this.restartDevice = false;
    this.updateDeviceAppModal.hide();
  }
  selectedDevices(event) {
    this.devicesSelected = event;
  }
  updateDeviceApp() {
    const updateAppSubscription = this.appPackageService.updateDevicesApp(this.devicesSelectedForUpdate).subscribe((data => {
      this.toastrService.show(
        '<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp App update initiated  </span>',
        ' ',
        {
          enableHtml: true,
          titleClass: 'background',
          positionClass: 'toast-top-center',
        }
      );
      this.appPackageService.resetValues();
      this.updateDeviceAppModal.hide();
      this.router.navigate(['/apppackage'], { queryParams: { updateType: 4 } });
    }));
    this.updateDeviceAppModal.hide();
    this.subscribers.push(updateAppSubscription);
  }
  updateAllDeviceWithFirmware() {
    this.deviceSelectedForFirmwareUpdate = {
      devices: [],
      firmwareVersion: this.selectedPackageName
    };
    this.updateFirmware();

  }
  updateDevicesWithFirmware() {
    this.updateDeviceFirmwareModal.show();
  }
  updateFirmwareForSelectedDevices() {
    this.deviceSelectedForFirmwareUpdate = {
      devices: this.devicesSelected,
      firmwareVersion: this.selectedPackageName
    };
    this.updateFirmware();
  }

  updateFirmware() {
    this.firmwareService.updateDevicesFirmware(this.deviceSelectedForFirmwareUpdate).subscribe((data) => {
      this.toastrService.show(
        `<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp  Firmware Update Initiated</span>`,
        ' ',
        {
          enableHtml: true,
          titleClass: 'background',
          positionClass: 'toast-top-center',
        }
      );
      this.firmwareService.resetValues();
      this.router.navigate(['/firmware'], { queryParams: { updateType: 4 } });
    });
    this.updateDeviceFirmwareModal.hide();
  }
  goToApps() {
    this.router.navigate(['/apppackage'], { queryParams: { updateType: 4 } });
  }
  goToFirmware() {
    this.router.navigate(['/firmware'], { queryParams: { updateType: 4 } });
  }
}
