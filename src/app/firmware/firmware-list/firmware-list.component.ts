import { Component, OnInit, OnDestroy, ViewChild, SimpleChanges, DoCheck } from '@angular/core';
import { BaseComponent } from '../../base-component.component';
import { FirmwareService } from './../firmware.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UpdateType } from 'src/app/shared/models/update.type';
import { Router, ActivatedRoute } from '@angular/router';
import { DeviceService } from '../../devices/device.service';
import { FirmwareResponse } from '../../shared/models/device.model';
import { AppPackageService } from '../../shared/models/services/appPackages.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import { WebSocketService } from 'src/app/web-socket.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-firmware-list',
  templateUrl: './firmware-list.component.html',
  styleUrls: ['./firmware-list.component.scss'],
})
export class FirmwareListComponent extends BaseComponent
  implements OnInit, OnDestroy, DoCheck {
  @ViewChild('releaseNotesModal', { static: false }) releaseNotesModal: ModalDirective;
  @ViewChild('firmwareReleaseNotesModal', { static: false }) firmwareReleaseNotesModal: ModalDirective;

  @ViewChild('updateModal', { static: false }) updateModal: ModalDirective;

  @ViewChild('UpdateHistoryModal', { static: false }) UpdateHistoryModal: ModalDirective;
  @ViewChild('cancelFirmwareInstallationModal', { static: false }) cancelFirmwareInstallationModal: ModalDirective;

  firmwareList;
  firmwareListLoaded: Promise<boolean>;
  /* Data will be assigned from child component */
  totaldeviceCount;
  selectedFirmware;
  releaseNotesHeader;
  historyData = [];

  /* type of page based on updateType */
  updateType = 4;
  pageTitle = '';
  breadCrumbList = [];
  firmwareValues;
  updateSuccessMessage;
  groupId;
  pageType;
  deviceSerial;
  deviceData;
  deviceDetails;
  firmwareJobId;
  firmwareDetailsForSelectedDevice;
  firmwareListForSelectedDevice;
  selectedDevice;
  totalSelectedDeviceList;
  pageName;
  configFirware: any;
  noOfElementsFirmware: any;
  selectedPageNum: any = 0;
  markdownReleaseNotes: any;
  modalHeaderText: any;
  totalDeviceCountFirmware: number;
  sortDirection = 'DESC';
  // firmware Release Notes
  firmwarereleaseNotes: any;
  firmwareHeader: any;
  userRoles;
  private loading = false;
  constructor(
    private router: Router,
    private firmwareService: FirmwareService,
    private toastrService: ToastrService,
    private appPackageService: AppPackageService,
    private deviceService: DeviceService,
    private route: ActivatedRoute,
    public webSocketService: WebSocketService,
    private titlecasePipe: TitleCasePipe
  ) {
    super();

    this.configFirware = {
      id: 'firmwareGridPagination',
      currentPage: 0,
      itemsPerPage: 10,
      totalItems: 0,
    };
  }

  ngOnInit(): void {
    this.userRoles = JSON.parse(localStorage.getItem('userRoles'));
    this.deviceSerial = this.route.snapshot.queryParamMap.get('serial');
    /*eslint radix: ["error", "as-needed"]*/
    this.updateType = parseInt(this.route.snapshot.queryParamMap.get('updateType'), 10);
    this.selectedDevice = JSON.parse(this.route.snapshot.queryParamMap.get('selectedDevice'));
    this.totaldeviceCount = parseInt(this.route.snapshot.queryParamMap.get('totalDeviceCount'), 10);
    this.totalSelectedDeviceList = JSON.parse(this.route.snapshot.queryParamMap.get('devicesSelected'));
    this.groupId =  this.route.snapshot.queryParamMap.get('groupId');
    this.pageType = this.route.snapshot.queryParamMap.get('pageType');
    this.pageName = this.route.snapshot.queryParamMap.get('pageName');
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.getFirewareList();
    this.fnFindPageType();

    this.webSocketService.getSocketMessage();
  }
  getDeviceDetailsData() {
    const deviceSubscription = this.deviceService.getDeviceDetails(this.deviceSerial).subscribe((data) => {
      const firmwareUpdateRequestData = [];
      this.deviceDetails = data;
      this.firmwareDetailsForSelectedDevice = this.deviceDetails.firmware;
      this.firmwareDetailsForSelectedDevice.installedOn = new Date(parseInt(this.firmwareDetailsForSelectedDevice.installedOn)).toLocaleDateString('en-GB');
      this.firmwareDetailsForSelectedDevice.installedOn = this.firmwareDetailsForSelectedDevice.installedOn.replace(/[/]/g, "-");
      this.firmwareDetailsForSelectedDevice.installedOn = this.deviceService.swap_date_with_month_conversion(this.firmwareDetailsForSelectedDevice.installedOn, '-');
      if (this.deviceDetails.firmwareUpdateRequest) {
        firmwareUpdateRequestData.push(this.deviceDetails.firmwareUpdateRequest);
        this.firmwareList?.forEach((eachGridData, index) => {
          const eachData = eachGridData;
          const gridIndex = firmwareUpdateRequestData.findIndex(
            (d) => d.firmwareVersion === eachData.firmwareVersion
          );
          if (gridIndex === -1) {
            firmwareUpdateRequestData.push(eachData);
          }
        });
        this.firmwareListForSelectedDevice = firmwareUpdateRequestData;
      } else {
        this.firmwareListForSelectedDevice = this.firmwareList;
      }
      this.firmwareListForSelectedDevice.forEach(firmware => {
        firmware.status = this.titlecasePipe.transform(firmware.status);
        firmware.dateOfRelease = new Date(parseInt(firmware.releaseDate)).toLocaleDateString('en-GB');
        firmware.dateOfRelease = firmware.dateOfRelease.replace(/[/]/g, "-");
        firmware.dateOfRelease = this.deviceService.swap_date_with_month_conversion(firmware.dateOfRelease, '-');
      });
    });
    this.subscribers.push(deviceSubscription);
  }
  getFirewareList() {
    const subscription = this.firmwareService.fectAll().subscribe((data: FirmwareResponse) => {
      this.firmwareList = data;
      this.firmwareListLoaded = Promise.resolve(true);
      this.firmwareList.forEach(firmware => {
        firmware.status = this.titlecasePipe.transform(firmware.status);
        firmware.dateOfRelease = new Date(parseInt(firmware.releaseDate)).toLocaleDateString('en-GB');
        firmware.dateOfRelease = firmware.dateOfRelease.replace(/[/]/g, "-");
        firmware.dateOfRelease = this.deviceService.swap_date_with_month_conversion(firmware.dateOfRelease, '-');
      });
      this.firmwareList.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
      if (this.deviceSerial && this.updateType === 2) {
        this.getDeviceDetailsData();
      }
    },
      err => {
        this.firmwareListLoaded = Promise.resolve(false);
      });
    this.subscribers.push(subscription);
  }
  // emitted onSelectReleaseNotes from child
  getReleaseNotes(data: any) {
    this.releaseNotesModal.show();
    this.markdownReleaseNotes =
      `
        ${data.changeLog ? data.changeLog : '### No notes provided'}
      `;
    this.modalHeaderText = data.systemPackage ? data.packageVersion : data.packageName;
  }

 // Firmware Firmware Details & Update release notes
 firmwareReleaseNotes(data: any) {
  this.firmwareReleaseNotesModal.show();
  this.firmwarereleaseNotes =
    `
      ${data.changeLog ? data.changeLog : '### No notes provided'}
    `;
  this.firmwareHeader = data.firmwareVersion ? data.firmwareVersion : data.s3BucketName;
}

  fnFindPageType() {
    if (this.updateType == null || this.updateType === 4) {
      this.breadCrumbList.pop();
      this.breadCrumbList.push({
        name: 'Dashboard',
        path: '/devices'
      }, {
        name: 'Firmware',
        path: ''
      });
      this.pageTitle = 'Firmware';
    } else if (this.updateType === 0) {
      this.breadCrumbList.pop();
      this.breadCrumbList.push({
        name: 'Dashboard',
        path: '/devices'
      }, {
        name: 'Global Level Firmware Update',
        path: ''
      });
      this.pageTitle = 'Global Level Firmware Update';
    } else if (this.updateType === 1) {
      this.pageTitle = 'Group Level Firmware Update';
      this.breadCrumbList.pop();
      this.breadCrumbList.push({
        name: 'Dashboard',
        path: '/devices'
      }, {
        name: 'Device Group',
        path: `/groupDetails/${this.groupId}`
      }, {
        name: 'Group Level Firmware Update',
        path: ''
      });
    } else if (this.updateType === 2) {
      this.pageTitle = 'Firmware Details';
      this.breadCrumbList.pop();
      this.breadCrumbList.push({
        name: 'Dashboard',
        path: '/devices'
      }, {
        name: 'Device Details',
        path: `/deviceDetails/${this.deviceSerial}`
      }, {
        name: 'Firmware Details & Update',
        path: ''
      });
    } else if (this.updateType === 3) {
      this.pageTitle = 'Firmware Update';
      this.breadCrumbList.pop();
      this.breadCrumbList.push({
        name: 'Dashboard',
        path: '/devices'
      }, {
        name: 'Firmware Update',
        path: ''
      });
    }
  }
  onSelectFirmWare(firwarePackage) {
    const updateType = this.firmwareService.getUpdateType();
    this.selectedFirmware = firwarePackage;
    switch (this.updateType) { // it checks if the update is not by version.
      case 4:
        const data = {
          selectedFirmware: JSON.stringify(this.selectedFirmware),
          version: 'firmwareUpdate'
        };
        this.appPackageService.setVersionType(null);
        this.router.navigate(['/compatible'], { queryParams: data, skipLocationChange: false });
        break;
      case 0:
      case 1:
      case 2:
      case 3:
        this.totaldeviceCount = this.totaldeviceCount;
        this.updateModal.show();
        break;
      default:
        this.firmwareService.setSelectedFirmware(this.selectedFirmware);
        this.firmwareService.setUpdateType(UpdateType.Version);
        this.router.navigate(['/compatible'], { skipLocationChange: true });
      // need to navigate to screen for selecting devices which are suitablefor the selected firmware
    }
  }

  updateFirmware() {
    this.firmwareService.setSelectedFirmware(this.selectedFirmware);
    const deviceList = this.firmwareService.getSelectedDeviceList();
    this.firmwareValues = {
      devices: this.totalSelectedDeviceList,
      firmwareVersion: this.selectedFirmware.firmwareVersion
    };
    if (this.updateType === 2) {
      this.firmwareValues = {
        devices: [this.selectedDevice],
        firmwareVersion: this.selectedFirmware.firmwareVersion
      };
    }

    if (this.updateType === 0) {
      this.updateSuccessMessage = 'Global Level Firmware Update Initiated';
    } else if (this.updateType === 3 || this.updateType === 2) {
      this.updateSuccessMessage = 'Firmware Update Initiated';
    }

    // This is the service fuction for update firmware using API call
    if (this.updateType === 0 || this.updateType === 2 || this.updateType === 3) {
      this.firmwareService.updateDevicesFirmware(this.firmwareValues).subscribe((data) => {
        this.toastrService.show(
          `<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp ${this.updateSuccessMessage}</span>`,
          ' ',
          {
            enableHtml: true,
            titleClass: 'background',
            positionClass: 'toast-top-center'
          }
        );
        this.firmwareService.resetValues();
        if (this.updateType === 0) {
          this.router.navigate(['/devices']);
        } else if (this.updateType === 3 && this.pageType === 'groupDetails') {
          this.router.navigate(['/groupDetails', this.groupId]);
        } else if (this.updateType === 3 && this.pageName === 'devices') {
          this.router.navigate(['/devices']);
        } else if (this.updateType === 2) {
          this.getDeviceDetailsData();
          this.getFirewareList();
        }
      });
    } else if (this.updateType === 1) {
      this.firmwareService.updateGroupWithSelectedFirmware(this.groupId, this.selectedFirmware).subscribe((data) => {
        this.toastrService.show(
          `<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp Group Level Firmware Update Initiated</span>`,
          ' ',
          {
            enableHtml: true,
            titleClass: 'background',
            positionClass: 'toast-top-center'
          }
        );
        this.firmwareService.resetValues();
        this.router.navigate(['/groupDetails', this.groupId]);
      });
    }
    this.updateModal.hide();
  }

  openUpdateHistoryModal() {
    const params = new HttpParams()
    .set('pageIndex', this.selectedPageNum)
    .set('pageSize', this.configFirware.itemsPerPage)
    .set('sortDirection', this.sortDirection);

    const subscription = this.firmwareService.getFirmwareHistoryData(params, this.deviceSerial).subscribe((data) => {
      this.historyData = data.content;
      this.historyData.forEach(history => {
        let timeConvert = history.timestamp;
        history.timestamp = new Date(parseInt(history.timestamp)).toLocaleDateString('en-GB');
        history.timestamp = history.timestamp.replace(/[/]/g, "-");
        history.timestamp = this.deviceService.swap_date_with_month_conversion(history.timestamp, '-');
        history.time = new Date(parseInt(timeConvert)).toLocaleTimeString('en-GB');
      });
      this.configFirware.totalItems = data.totalElements;
      this.totalDeviceCountFirmware = data.totalElements;
      this.configFirware.currentPage = data.number + 1;
      this.noOfElementsFirmware = data.numberOfElements;
      this.UpdateHistoryModal.show();
    });
    this.subscribers.push(subscription);
  }
  onCancel(firwarePackage) {
    this.firmwareJobId = firwarePackage.jobId;
    this.cancelFirmwareInstallationModal.show();
  }

  pageChange(pageNumber: number) {
    this.selectedPageNum = pageNumber - 1;
    this.openUpdateHistoryModal();
    this.configFirware.currentPage = pageNumber;
  }

  onCancelInstallation() {
    // tslint:disable-next-line:max-line-length
    const cancelFirmwareInstallationSubscription =  this.firmwareService.cancelFirmwareInstallationForPendingStatus(this.deviceSerial, this.firmwareJobId).subscribe((data) => {
      this.toastrService.show(
        '<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp Firmware Updation cancelled </span>',
        ' ',
        {
          enableHtml: true,
          titleClass: 'background',
          positionClass: 'toast-top-center'
        }
      );
    });
    this.cancelFirmwareInstallationModal.hide();
    this.subscribers.push(cancelFirmwareInstallationSubscription);
  }
  onReInstall(firwarePackage) {
    const deviceList = this.selectedDevice;
    this.firmwareValues = {
      devices: [deviceList],
      firmwareVersion: firwarePackage.firmwareVersion
    };
    this.firmwareService.updateDevicesFirmware(this.firmwareValues).subscribe((data) => {
      this.toastrService.show(
        `<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp Device firmware update initiated</span>`,
        ' ',
        {
          enableHtml: true,
          titleClass: 'background',
          positionClass: 'toast-top-center'
        }
      );
      this.firmwareService.resetValues();
      this.updateModal.hide();
    });
  }

  ngDoCheck() {
    const socketJobStatusObject = JSON.parse(sessionStorage.getItem('socketObject'));
    let found = false;
    if (socketJobStatusObject) {

      socketJobStatusObject.forEach(device => {
        if (device.type === 'JobNotification' && device.deviceSerial === this.deviceSerial) {
          found = true;
          return;
        }
      });
      if (found) {
        this.getFirewareList();
        sessionStorage.removeItem('socketObject');
        return;
      }
    }
  }
}
