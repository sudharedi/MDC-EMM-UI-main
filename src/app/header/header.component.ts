import { Component, OnInit, ElementRef, ViewChild, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import {AlertsService  } from '../shared/models/services/alerts.service';
import { BaseComponent } from '../base-component.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { DeviceService } from '../devices/device.service';
import { LoginService } from '../login/login.service';
// import { TimerService } from '../shared/models/services/timer.service';
import { CognitoService } from 'src/app/auth/cognito.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends BaseComponent implements OnInit, DoCheck {
  @ViewChild('dropdownId') dropdownId: ElementRef;

  alertsData = [];
  currentUser: any;
  constructor(
    private alertsService: AlertsService,
    private router: Router,
    private toastrService: ToastrService,
    private authService: AuthService,
    private deviceService: DeviceService,
    private loginService: LoginService,
    public cognitoService: CognitoService,
  ) {
    super();
   }

  ngOnInit(): void {
    if(this.loginService.getAccessToken()){
      this.getCurrentUser();  
    }
  }


  getAlerts() {
    const subscription = this.alertsService.fectAll().subscribe(data => {
      this.alertsData = data;
      this.alertsData.forEach(history => {
        let timeConvert = history.timestamp;
        history.timestamp = new Date(parseInt(history.timestamp)).toLocaleDateString('en-GB');
        history.timestamp = history.timestamp.replace(/[/]/g, "-");
        history.timestamp = this.deviceService.swap_date_with_month_conversion(history.timestamp, '-');
        history.time = new Date(parseInt(timeConvert)).toLocaleTimeString('en-GB');
      });
    });

  }

  hideDropdown() {
    this.dropdownId.nativeElement.classList.remove('show');
    this.router.navigate(['/alertsnotifications'], { skipLocationChange: false });
  }

  clearNotifications() {
    this.alertsService.clearNotifications().subscribe(data => {
      this.toastrService.show(
        '<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp All Notifications cleared </span>',
        ' ',
        {
          enableHtml: true,
          titleClass: 'background',
          positionClass: 'toast-top-center',
        }
      );
      location.reload();
    });
  }

  getCurrentUser() {
    this.deviceService.getCurrentUser().subscribe(data => {
      this.currentUser = data;
      localStorage.setItem('tenantId', this.currentUser.tenantId);
      this.getAlerts();
    },
      err => {
        // should handle error from getCurrentUser
        console.error(err);
      });
  }

  logout() {
    if (localStorage.getItem('sso_data')) {
      localStorage.removeItem('sso_data');
      this.cognitoService.coporatelogout();
    }
    else {
      this.authService.logout();
    }
    localStorage.clear();
    this.loginService.logout();
  }

  ngDoCheck() {
    const socketJobStatusObject = JSON.parse(sessionStorage.getItem('socketObjectEventLogs'));
    let found = false;
    if (socketJobStatusObject) {
      socketJobStatusObject.forEach(device => {
        if (device.type === 'JobNotification' || device.type === 'CertificateNotification'
          || device.type === 'EnrollmentNotification') {
          found = true;
          return;
        }
      });
      if (found) {
        this.getAlerts();
        sessionStorage.removeItem('socketObjectEventLogs');
        return;
      }
    }
  }
}
