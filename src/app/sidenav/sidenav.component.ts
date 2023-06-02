import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DeviceService } from '../devices/device.service';
import { FirmwareService } from '../firmware/firmware.service';
import { AppPackageService } from '../shared/models/services/appPackages.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  isFirmware = false;
  userRoles;
  constructor(
    private router: Router,
    private firmwareService: FirmwareService,
    private appPackageService: AppPackageService,
    private deviceService: DeviceService

  ) { }

  ngOnInit(): void {

    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          if (this.router.url === '/firmware') {
            this.isFirmware = true;
          } else {
            this.isFirmware = false;
          }
        }
      }
    );
    this.userRoles = JSON.parse(localStorage.getItem('userRoles'));

  }

  firmwareNavigation() {
    this.isFirmware = true;
    this.firmwareService.setUpdateType(null);
    this.router.navigate(['/firmware'], { queryParams: { updateType: 4 } });
  }
  appNavigation() {
    this.router.navigate(['/apppackage'], { queryParams: { updateType: 4 } });
  }
}
