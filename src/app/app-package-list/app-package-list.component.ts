import { Component, OnInit, ViewChild } from '@angular/core';
import { AppPackageService } from '../shared/models/services/appPackages.service';
import { BaseComponent } from '../base-component.component';
import { InstalledApps } from '../../app/shared/models/device.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UpdateType } from '../shared/models/update.type';
import { FirmwareService } from '../firmware/firmware.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TitleCasePipe } from '@angular/common';
import { DeviceService } from '../devices/device.service';

@Component({
  selector: 'app-package-list',
  templateUrl: './app-package-list.component.html',
  styleUrls: ['./app-package-list.component.scss']
})
export class AppPackageListComponent extends BaseComponent implements OnInit {
  @ViewChild('updateDeviceAppModal') updateDeviceAppModal: ModalDirective;
  @ViewChild('releaseNotesModal', { static: false }) releaseNotesModal: ModalDirective;
  selectedTabName = 'defaultpackages';
  allPackageData;
  updateType;
  selectedApp;
  totaldeviceCount;
  restartDevice: false;
  selectedAppPackageName;
  popupHeaderText;
  appValues;
  groupId;
  updateSuccessMessage;
  selectedDeviceList;
  numberOfDevicesInAGroup;
  markdownReleaseNotes: any;
  modalHeaderText = '';
  userRoles;

  constructor(
    private deviceService: DeviceService,
    private appPackageService: AppPackageService, private router: Router,
    private toastrService: ToastrService,
    private firmwareService: FirmwareService,
    private route: ActivatedRoute,
    private titlecasePipe: TitleCasePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.userRoles = JSON.parse(localStorage.getItem('userRoles'));
    this.getAppPackageData();
    this.restartDevice = false;
    this.selectedDeviceList = JSON.parse(this.route.snapshot.queryParamMap.get('devicesSelected'));
    this.updateType = parseInt(this.route.snapshot.queryParamMap.get('updateType'), 10);
    this.totaldeviceCount = parseInt(this.route.snapshot.queryParamMap.get('totalDeviceCount'), 10);
    this.groupId = this.route.snapshot.queryParamMap.get('groupId');
    this.numberOfDevicesInAGroup = parseInt(this.route.snapshot.queryParamMap.get('numberOfDevicesInAGroup'), 10);
  }
  /* tab selection functionality */
  changeTabSelection(tabName) {
    this.selectedTabName = tabName;
  }
  getAppPackageData() {
    const subscription = this.appPackageService.fectAll().subscribe((data: InstalledApps) => {
      this.allPackageData = data;
      this.allPackageData.forEach(app => {
        app.status = this.titlecasePipe.transform(app.status);
        app.dateOfRelease = new Date(parseInt(app.releaseDate)).toLocaleDateString('en-GB');
        app.dateOfRelease = app.dateOfRelease.replace(/[/]/g, "-");
        app.dateOfRelease = this.deviceService.swap_date_with_month_conversion(app.dateOfRelease, '-');
      });
      this.allPackageData.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    });
    this.subscribers.push(subscription);
  }

  onSelectAppPackage(appPackage) {
    this.selectedApp = appPackage;
    this.selectedAppPackageName = appPackage.systemPackage ? appPackage.packageVersion : appPackage.packageName;
    switch (this.updateType) { // it checks if the update is not by version.
      case 4:
        this.firmwareService.setVersionType(null);
        const data = {
          selectedAppPackage: JSON.stringify(this.selectedApp),
          versionType: 'appUpdate'
        };
        this.router.navigate(['/compatible'], { queryParams: data, skipLocationChange: false });
        break;
      case 0:
      case 1:
      case 2:
      case 3:
        this.totaldeviceCount = this.totaldeviceCount;
        this.appPackageService.setSelectedAppPackage(this.selectedApp);
        this.onInstallButtonClick();
        break;
      default:
        this.appPackageService.setSelectedAppPackage(this.selectedApp);
        this.appPackageService.setUpdateType(UpdateType.Version);
        this.router.navigate(['/compatible'], { skipLocationChange: true });
    }
  }
  onInstallButtonClick() {
    const deviceList = this.appPackageService.getSelectedDeviceList();
    this.fnFindPageType();
    this.appValues = {
      devices: this.selectedDeviceList,
      force: false,
      restart: this.restartDevice,
      softwarePackageId: this.selectedApp.id
    };
    if (this.updateType === 0 || this.updateType === 3) {
      const updateAppSubscription = this.appPackageService.updateDevicesApp(this.appValues).subscribe((data => {
        if (data.length) {
          this.appPackageService.setNonCompatibleDeviceList(data);
          // tslint:disable-next-line:max-line-length
          this.router.navigate(['/noncompatible'], { queryParams: { nonCompatibledeviceList: JSON.stringify(data), selectedDeviceList: JSON.stringify(this.selectedDeviceList), updateType: parseInt(this.route.snapshot.queryParamMap.get('updateType'), 10), totalDeviceCount: parseInt(this.route.snapshot.queryParamMap.get('totalDeviceCount'), 10), groupId: this.route.snapshot.queryParamMap.get('groupId'), selectedAppPackage: JSON.stringify(this.selectedApp) }, skipLocationChange: false });
        } else {
          this.updateDeviceAppModal.show();
        }
      }));
    } else if (this.updateType === 1) {
      // tslint:disable-next-line:max-line-length
      const updateAppSubscriptionWhenForceIsFalse = this.appPackageService.updateGroupAppPackages(this.groupId, this.appValues).subscribe((response => {
        if (response.length) {
          // tslint:disable-next-line:max-line-length
          this.router.navigate(['/noncompatible'], { queryParams: { nonCompatibledeviceList: JSON.stringify(response), selectedDeviceList: JSON.stringify(this.selectedDeviceList), updateType: parseInt(this.route.snapshot.queryParamMap.get('updateType'), 10), totalDeviceCount: parseInt(this.route.snapshot.queryParamMap.get('totalDeviceCount'), 10), groupId: this.route.snapshot.queryParamMap.get('groupId'), selectedAppPackage: JSON.stringify(this.selectedApp), totalDevicesInGroup: parseInt(this.route.snapshot.queryParamMap.get('numberOfDevicesInAGroup'), 10) }, skipLocationChange: false });
        } else {
          this.updateDeviceAppModal.show();
        }
      }));
      this.subscribers.push(updateAppSubscriptionWhenForceIsFalse);
    }

  }
  updateDeviceApp() {
    this.appValues = {
      devices: this.selectedDeviceList,
      force: true,
      restart: this.restartDevice,
      softwarePackageId: this.selectedApp.id
    };
    if (this.updateType === 0) {
      this.updateSuccessMessage = 'Global Level App Update Initiated';
    } else if (this.updateType === 3) {
      this.updateSuccessMessage = 'App Update Initiated';
    }
    if (this.updateType === 0 || this.updateType === 3) {
      const updateAppSubscriptionWhenForceIsTrue = this.appPackageService.updateDevicesApp(this.appValues).subscribe((response => {
        this.toastrService.show(
          `<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp ${this.updateSuccessMessage}</span>`,
          ' ',
          {
            enableHtml: true,
            titleClass: 'background',
            positionClass: 'toast-top-center'
          }
        );
        this.updateDeviceAppModal.hide();
        if (this.updateType === 0) {
          this.router.navigate(['/devices']);
        } else if (this.updateType === 3) {
          this.router.navigate(['/groupDetails', this.groupId]);
        }
        this.appPackageService.resetValues();
      }));
      this.subscribers.push(updateAppSubscriptionWhenForceIsTrue);
    } else if (this.updateType === 1) {
      // tslint:disable-next-line:max-line-length
      const updateAppSubscriptionWhenForceIsTrue = this.appPackageService.updateGroupAppPackages(this.groupId, this.appValues).subscribe((response => {
        this.toastrService.show(
          '<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp Group Level Update Initiated </span>',
          ' ',
          {
            enableHtml: true,
            titleClass: 'background',
            positionClass: 'toast-top-center'
          }
        );
        this.appPackageService.resetValues();
        this.router.navigate(['/groupDetails', this.groupId]);
      }));
      this.subscribers.push(updateAppSubscriptionWhenForceIsTrue);
    }
    this.updateDeviceAppModal.hide();
  }

  closePopUp() {
    this.restartDevice = false;
    this.updateDeviceAppModal.hide();
  }
  fnFindPageType() {
    if (this.updateType == null || this.updateType === 4 || this.updateType === 3) {
      this.popupHeaderText = 'App Package update';
    } else if (this.updateType === 0) {
      this.popupHeaderText = 'Global Level App Package update';
    } else if (this.updateType === 1) {
      this.popupHeaderText = 'Group Level App Package update';
    }
  }
  getReleaseNotes(data: any) {
    this.releaseNotesModal.show();
    this.markdownReleaseNotes =
      `
        ${data.changeLog ? data.changeLog : '### No notes provided'}
      `;
    this.modalHeaderText = data.systemPackage ? data.packageVersion : data.packageName;
  }
}
