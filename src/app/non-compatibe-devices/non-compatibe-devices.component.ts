import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base-component.component';
import { AppPackageService } from '../shared/models/services/appPackages.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from '../web-socket.service';


@Component({
  selector: 'app-non-compatibe-devices',
  templateUrl: './non-compatibe-devices.component.html',
  styleUrls: ['./non-compatibe-devices.component.scss']
})
export class NonCompatibeDevicesComponent extends BaseComponent implements OnInit {
  @ViewChild('updateDeviceAppModal') updateDeviceAppModal: ModalDirective;
  devicesList = [];

  /* grid configuration options */

  selectedAppPackageName;
  nonCompatibleDeviceList;
  restartDevice;
  appPackage;
  totalCompatibleDeviceCount;
  updateType;
  disableProceedButton = false;
  deviceList;
  totaldeviceCount;
  groupId;
  totalDevicesInGroup;
  constructor(
    private appPackageService: AppPackageService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    public webSocketService: WebSocketService

  ) {
    super();

  }

  ngOnInit(): void {
    this.nonCompatibleDeviceList = this.route.snapshot.queryParamMap.get('nonCompatibledeviceList');
    this.deviceList = JSON.parse(this.route.snapshot.queryParamMap.get('selectedDeviceList'));
    this.updateType = parseInt(this.route.snapshot.queryParamMap.get('updateType'), 10);
    this.totaldeviceCount = parseInt(this.route.snapshot.queryParamMap.get('totalDeviceCount'), 10);
    this.groupId = this.route.snapshot.queryParamMap.get('groupId');
    this.appPackage = JSON.parse(this.route.snapshot.queryParamMap.get('selectedAppPackage'));
    this.totalDevicesInGroup =  parseInt(this.route.snapshot.queryParamMap.get('totalDevicesInGroup'), 10);
    this.getNonCompatibleDeviceList();
    this.restartDevice = false;
  }

  getNonCompatibleDeviceList() {
    this.nonCompatibleDeviceList = JSON.parse(this.nonCompatibleDeviceList);
    this.selectedAppPackageName = this.appPackage?.systemPackage ? this.appPackage?.packageVersion : this.appPackage?.packageName;
    // tslint:disable-next-line:max-line-length
    if (this.nonCompatibleDeviceList?.length === this.deviceList?.length || this.nonCompatibleDeviceList?.length === this.totalDevicesInGroup) {
      this.disableProceedButton = true;
    }
  }
  ignoreAndProceed() {
    if(this.updateType === 1) {
      this.totalCompatibleDeviceCount = this.totaldeviceCount - this.nonCompatibleDeviceList?.length;
    this.updateDeviceAppModal.show();
    } else {

      this.totalCompatibleDeviceCount = this.totaldeviceCount - this.nonCompatibleDeviceList?.length;
      this.updateDeviceAppModal.show();
    }
  }
  updateDeviceApp() {
    const values = {
      devices: this.deviceList,
      force: true,
      restart: this.restartDevice,
      softwarePackageId: this.appPackage?.id
    };
    if (this.updateType === 0) {
      const updateAppSubscription = this.appPackageService.updateDevicesApp(values).subscribe((data => {
        this.toastrService.show(
          '<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp  Global Level App Update Initiated  </span>',
          ' ',
          {
            enableHtml: true,
            titleClass: 'background',
            positionClass: 'toast-top-center',
          }
        );
        this.appPackageService.resetValues();
        this.router.navigate(['/devices']);
      }));
      this.subscribers.push(updateAppSubscription);
    } else if (this.updateType === 3) {
      const updateAppSubscription = this.appPackageService.updateDevicesApp(values).subscribe((data => {
        this.toastrService.show(
          `<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp  App Update Initiated for ${this.totalCompatibleDeviceCount} device(s)  </span>`,
          ' ',
          {
            enableHtml: true,
            titleClass: 'background',
            positionClass: 'toast-top-center',
          }
        );
        this.appPackageService.resetValues();
        this.router.navigate(['/groupDetails', this.groupId]);
      }));
      this.subscribers.push(updateAppSubscription);
    } else if (this.updateType === 1) {
      // tslint:disable-next-line:max-line-length
      const updateAppSubscriptionWhenForceIsTrue = this.appPackageService.updateGroupAppPackages(this.groupId, values).subscribe((response => {
        this.toastrService.show(
          '<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp Group Level App Update Initiated </span>',
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
  changeAppVersion() {
    const data = {
      devicesSelected: JSON.stringify(this.deviceList),
      updateType: this.updateType,
      totalDeviceCount: this.totaldeviceCount,
      groupId: this.groupId
    };
    this.router.navigate(['/apppackages'], { queryParams: data });
  }

}
