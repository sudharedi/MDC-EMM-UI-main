import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ModalDirective   } from 'ngx-bootstrap/modal';
import { SecurityService } from '../shared/models/services/security.service';
import { CertificateResponse } from '../shared/models/certificate.model';
import { BaseComponent } from '../base-component.component';
import { ToastrService } from 'ngx-toastr';
import { DeviceService } from '../devices/device.service';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent extends BaseComponent implements OnInit, DoCheck {
  @ViewChild('revokeModal', { static: false }) revokeModal: ModalDirective;

  allCertificateData;
  certificateData;
  securityDetails = true;
  certificateId;
  deviceSerial;
  deviceData: any;
  certificateUpdateRequest: any;
  diffDays;
  userRoles;
  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute,
              private router: Router,
              private securityService: SecurityService,
              private toastrService: ToastrService,
              private deviceService: DeviceService,
              public webSocketService: WebSocketService) {
    super();
  }


  ngOnInit(): void {
    this.userRoles = JSON.parse(localStorage.getItem('userRoles'));
    this.route.params.subscribe((id: Params) => {
      this.deviceSerial = id.id;
    });
    if(this.userRoles?.SOTA.allowed) {
      this.getAllCertificates();
    } else {
      this.getDeviceDetails();
    }
    this.webSocketService.getSocketMessage();
    // this.userRoles = JSON.parse(localStorage.getItem('userRoles'));
  }

  getAllCertificates() {
    const certificatesSubscription = this.securityService.fectAll().subscribe((data: CertificateResponse) => {
      // if(data.code === 403) {
      //   this.getDeviceDetails();
      // } else {
        this.allCertificateData = data;
        this.allCertificateData.sort((a, b) => new Date(b.issuedOn).getTime() - new Date(a.issuedOn).getTime());
        this.getDeviceDetails();
      // }

    });

    this.subscribers.push(certificatesSubscription);

  }

  getDeviceDetails() {
    const deviceSubscription = this.deviceService.getDeviceDetails(this.deviceSerial).subscribe((data) => {
      this.deviceData = data;
      this.certificateId = this.deviceData.certificate.certificateId;
      this.certificateUpdateRequest = this.deviceData.certificateUpdateRequest;
      this.certificateData = this.deviceData.certificate;

      const date1 = new Date().getTime();
      const date2 = new Date(this.certificateData.expiresOn).getTime();
      this.diffDays = Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24));
      if (this.deviceData?.certificateUpdateRequest && this.userRoles?.SOTA.allowed) {
        this.allCertificateData.unshift(this.deviceData.certificateUpdateRequest);
      }
    });
    this.subscribers.push(deviceSubscription);
  }

  revokeCertificate() {
    this.revokeModal.hide();
    const revokeSubscription = this.securityService.revokeCertificate(this.certificateId).subscribe(data => {
      this.securityDetails = false;
    });

    this.subscribers.push(revokeSubscription);
  }

  openRevokeCertificateModal() {
    this.revokeModal.show();
  }
  restoreCertificate() {
    this.securityDetails = true;
  }

  updateCertificate(event) {
    const updateSubscription = this.securityService.updateCertificate(event.certificateId, this.deviceSerial).subscribe(data => {
      this.toastrService.show(
        `<img src="../../assets/images/success.svg"  alt="icon">
         <span> &nbsp&nbsp&nbsp Certificates update initiated successfully </span>`,
        ' ',
        {
          enableHtml: true,
          titleClass: 'background',
          positionClass: 'toast-top-center',
        }
      );

      this.getAllCertificates();
    });

    this.subscribers.push(updateSubscription);
  }

  cancelCertificateUpdate(event) {
    // tslint:disable-next-line:max-line-length
    const deleteSubscription = this.securityService.deletePendingCertficate(this.deviceSerial, this.certificateUpdateRequest.jobId).subscribe(data => {
      this.toastrService.show(
        `<img src="../../assets/images/success.svg"  alt="icon">
         <span> &nbsp&nbsp&nbsp Certificates update cancelled </span>`,
        ' ',
        {
          enableHtml: true,
          titleClass: 'background',
          positionClass: 'toast-top-center',
        }
      );
      this.getAllCertificates();
    });
    this.subscribers.push(deleteSubscription);
  }

  navigateToViewDetails() {
    this.router.navigate(['/deviceDetails', this.deviceSerial]);
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
        this.getAllCertificates();
        sessionStorage.removeItem('socketObject');
        return;
      }
    }
  }

}
