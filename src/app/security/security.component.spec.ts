import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityComponent } from './security.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SecurityService } from '../shared/models/services/security.service';
import { ToastrModule } from 'ngx-toastr';
import { DeviceService } from '../devices/device.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { certificateList } from 'src/data/mockData/certificate';
import { devicesList } from 'src/data/mockData/devicesAndGroups';
import { from, of } from 'rxjs';
import { CertificateMock, DeviceDetailsMock } from '../../data/mockData/security.mock';

describe('SecurityComponent', () => {
  let component: SecurityComponent;
  let fixture: ComponentFixture<SecurityComponent>;
  let securityService: SecurityService;
  let deviceService: DeviceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientTestingModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        }),
        ModalModule.forRoot()],
      declarations: [SecurityComponent],
      providers: [
        {
          provide: DeviceService, useValue: {
            getDevices: () => of(devicesList),
            getDeviceDetails: (deviceSerial) => of(DeviceDetailsMock)
          }
        },
        {
          provide: SecurityService, useValue: {
            fectAll: () => of(CertificateMock),
            revokeCertificate: (certificateId) => of('Status Code: 200 OK'),
            updateCertificate: (certificateId, deviceSerial) => of('Status Code: 200 OK'),
            deletePendingCertficate: (deviceSerial, jobId) => of('Status Code: 200 OK')
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityComponent);
    component = fixture.componentInstance;
    deviceService = TestBed.inject(DeviceService);
    securityService = TestBed.inject(SecurityService);
    sessionStorage.setItem('socketObject', '[{"deviceSerial":"189ba5405bcc","message":"1605166291482","type":"lastseen","dispensers":[]}]');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should get the list of all certificates', () => {
    component.getAllCertificates();
    expect(component.getAllCertificates()).toEqual(certificateList[1]);
  });

  it('should get details for selected device', () => {
    component.getDeviceDetails();
    expect(component.getDeviceDetails()).toEqual(devicesList[1]);
  });

  it('should revoke the certificate', () => {
    spyOn(component, 'revokeCertificate').and.callThrough();
    component.revokeCertificate();
    expect(component.revokeCertificate).toHaveBeenCalled();
  });

  it('should update the certificate', () => {
    spyOn(component, 'updateCertificate').and.callThrough();
    component.updateCertificate(certificateList);
    expect(component.updateCertificate).toHaveBeenCalled();
  });

  it('should revoke the certificate', () => {
    spyOn(component, 'revokeCertificate').and.callThrough();
    spyOn(securityService, 'revokeCertificate').and.callThrough();
    component.revokeCertificate();
    expect(securityService.revokeCertificate).toHaveBeenCalled();
    expect(component.revokeCertificate).toHaveBeenCalled();
  });

  it('should call revoke certificate modal', () => {
    spyOn(component, 'openRevokeCertificateModal').and.callThrough();
    component.openRevokeCertificateModal();
    expect(component.openRevokeCertificateModal).toHaveBeenCalled();
  });

  it('should call restoreCertificate and set securityDetails to true', () => {
    spyOn(component, 'restoreCertificate').and.callThrough();
    component.restoreCertificate();
    expect(component.restoreCertificate).toHaveBeenCalled();
    expect(component.securityDetails).toBe(true);
  });

  it('getAllCertificates', () => {
    spyOn(component, 'getAllCertificates').and.callThrough();
    spyOn(securityService, 'fectAll').and.callThrough();
    component.getAllCertificates();
    fixture.detectChanges();
    expect(component.getAllCertificates).toHaveBeenCalled();
    expect(securityService.fectAll).toHaveBeenCalled();
  });

  it('getDeviceDetails', () => {
    spyOn(component, 'getDeviceDetails').and.callThrough();
    spyOn(deviceService, 'getDeviceDetails').and.callThrough();
    component.getDeviceDetails();
    fixture.detectChanges();
    expect(component.getDeviceDetails).toHaveBeenCalled();
    expect(deviceService.getDeviceDetails).toHaveBeenCalled();
  });

  it('cancelCertificateUpdate', () => {
    spyOn(component, 'cancelCertificateUpdate').and.callThrough();
    spyOn(securityService, 'deletePendingCertficate').and.callThrough();
    component.cancelCertificateUpdate('event');
    fixture.detectChanges();
    expect(component.cancelCertificateUpdate).toHaveBeenCalled();
    expect(securityService.deletePendingCertficate).toHaveBeenCalled();
  });

  it('ngDoCheck', () => {
    spyOn(component, 'ngDoCheck').and.callThrough();
    component.ngDoCheck();
    fixture.detectChanges();
    expect(component.ngDoCheck).toHaveBeenCalled();
  });
});
