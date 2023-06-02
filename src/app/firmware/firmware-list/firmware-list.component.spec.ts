import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { FirmwareListComponent } from './firmware-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { deviceGroups, devicesListGrid, groupList, devicesList, FirmwareMock } from 'src/data/mockData/devicesAndGroups';
import { DeviceService } from '../../devices/device.service';
import { Observable, of } from 'rxjs';
import { FirmwareComponent } from '../firmware/firmware.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { FirmwareService } from '../firmware.service';
import { TitleCasePipe } from '@angular/common';


describe('FirmwareListComponent', () => {
  let component: FirmwareListComponent;
  let fixture: ComponentFixture<FirmwareListComponent>;
  let deviceService: DeviceService;
  let firmwareService: FirmwareService;

  const sampleFirmwareData = {
    changeLog: 'created for QA testing',
    checkSum: '17887',
    fileSize: '111MB',
    firmwareVersion: 'QA_1.0',
    installedOn: 0,
    packageLocation: 'newfolder_QA.tar',
    releaseDate: 4092020,
    s3BucketName: 'QA_Updated_fota1',
    signatureLocation: 'QA_1.sign',
    status: 'done'
  };
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        }),
        ModalModule.forRoot(),
        NgxPaginationModule
      ],
      declarations: [FirmwareListComponent, FirmwareComponent],
      providers: [
        {
          provide: DeviceService, useValue: {
            getDevices: () => of(devicesList),
            getDeviceDetails: (serial) => of(devicesList)
          }
        },
        {
          provide: FirmwareService, useValue: {
            fectAll: () => of(FirmwareMock),
            getUpdateType: () => of(1),
            setSelectedFirmware: () => of(),
            getFirmwareHistoryData: () => of(FirmwareMock),
            getSelectedDeviceList: () => of(devicesListGrid),
            updateDevicesFirmware: () => of('success'),
            setUpdateType: (version) => of(),
            resetValues: () => of(),
            cancelFirmwareInstallationForPendingStatus: (deviceSerial, firmwareJobId) => of('success'),
          }
        },
        TitleCasePipe
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmwareListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    deviceService = TestBed.inject(DeviceService);
    firmwareService = TestBed.inject(FirmwareService);
    component.configFirware = {
      id: 'firmwareGridPagination',
      currentPage: 0,
      itemsPerPage: 10,
      totalItems: 0,
    };
    sessionStorage.setItem('socketObject', '[{"deviceSerial":"189ba5405bcc","message":"1605166291482","type":"lastseen","dispensers":[]}]');
    fixture.detectChanges();
  });

  it('should create firmware list component', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should be called', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('on ngOnInit it should call getFirewareList()', () => {
    component.updateType = 2;
    spyOn(component, 'getFirewareList').and.callThrough();
    spyOn(firmwareService, 'fectAll').and.callThrough();
    component.ngOnInit();
    expect(component.getFirewareList).toHaveBeenCalled();
    expect(firmwareService.fectAll).toHaveBeenCalled();
  });

  it('should call openUpdateHistoryModal', () => {
    spyOn(component, 'openUpdateHistoryModal').and.callThrough();
    component.openUpdateHistoryModal();
    expect(component.openUpdateHistoryModal).toHaveBeenCalled();
  });

  it('should call getDeviceDetailsData', () => {
    spyOn(component, 'getDeviceDetailsData').and.callThrough();
    spyOn(deviceService, 'getDeviceDetails').and.callThrough();
    component.getDeviceDetailsData();
    expect(component.getDeviceDetailsData).toHaveBeenCalled();
    expect(deviceService.getDeviceDetails).toHaveBeenCalled();
  });

  it('should call onSelectFirmWare', () => {
    spyOn(component, 'onSelectFirmWare');
    component.onSelectFirmWare(devicesListGrid[1]);
    expect(component.onSelectFirmWare).toHaveBeenCalled();
  });
  it('Pagetitle should be \'Global Level Firmware Update\' when updateType is 0', () => {
    spyOn(component, 'fnFindPageType').and.callThrough();
    component.updateType = 0;
    component.fnFindPageType();
    expect(component.pageTitle).toBe('Global Level Firmware Update');
  });

  it('Pagetitle should be \'Group Level Firmware Update\' when updateType is 1', () => {
    spyOn(component, 'fnFindPageType').and.callThrough();
    component.updateType = 1;
    component.fnFindPageType();
    expect(component.pageTitle).toBe('Group Level Firmware Update');
  });

  it(`Pagetitle should be 'Firmware Details' when updateType is 2`, () => {
    spyOn(component, 'fnFindPageType').and.callThrough();
    component.updateType = 2;
    component.fnFindPageType();
    expect(component.pageTitle).toBe('Firmware Details');
  });

  it('fnFindPageType if condition', () => {
    spyOn(component, 'fnFindPageType').and.callThrough();
    component.updateType = 4 ;
    component.fnFindPageType();
    expect(component.pageTitle).toBe('Firmware');
  });

  it('fnFindPageType if condition', () => {
    spyOn(component, 'fnFindPageType').and.callThrough();
    component.updateType = 3 ;
    component.fnFindPageType();
    expect(component.pageTitle).toBe('Firmware Update');
  });

  it('should call getReleaseNotes from child component', () => {
    const spy = spyOn(component, 'getReleaseNotes');
    component.getReleaseNotes(devicesListGrid[0]);
    expect(spy).toHaveBeenCalled();
  });

  it('onSelectFirmWare Branches testing - UpdateType = 0', () => {
    component.updateType = 0;
    expect(component.onSelectFirmWare(sampleFirmwareData)).toEqual();
  });

  it('onSelectFirmWare Branches testing - UpdateType = 1', () => {
    component.updateType = 1;
    expect(component.onSelectFirmWare(sampleFirmwareData)).toEqual();
  });

  it('onSelectFirmWare Branches testing - UpdateType = 2', () => {
    component.updateType = 2;
    expect(component.onSelectFirmWare(sampleFirmwareData)).toEqual();
  });

  it('onSelectFirmWare Branches testing - UpdateType = 3', () => {
    component.updateType = 3;
    expect(component.onSelectFirmWare(sampleFirmwareData)).toEqual();
  });

  it('should call onCancelInstallation on proceed click in cancelFirmwareInstallationModal', fakeAsync(() => {
    spyOn(component, 'onCancelInstallation').and.callThrough();
    component.onCancelInstallation();
    expect(component.onCancelInstallation).toHaveBeenCalled();
  }));

  it(`should call onReInstall from child component`, () => {
    spyOn(component, 'onReInstall').and.callThrough();
    component.onReInstall(sampleFirmwareData);
    expect(component.onReInstall).toHaveBeenCalled();
  });

  it(`should call onCancel`, () => {
    spyOn(component, 'onCancel').and.callThrough();
    component.onCancel(sampleFirmwareData);
    expect(component.onCancel).toHaveBeenCalled();
  });

  it(`should call getReleaseNotes`, () => {
    spyOn(component, 'getReleaseNotes').and.callThrough();
    component.getReleaseNotes(sampleFirmwareData);
    expect(component.getReleaseNotes).toHaveBeenCalledWith(sampleFirmwareData);
  });

  it(`should call updateFirmware`, () => {
    component.selectedFirmware = {
      firmwareVersion: 'v26.08.2020-HF123'
    };
    component.firmwareValues = {
      devices: devicesListGrid,
      firmwareVersion: component.selectedFirmware.firmwareVersion
    };
    spyOn(component, 'updateFirmware').and.callThrough();
    component.updateFirmware();
    expect(component.updateFirmware).toHaveBeenCalled();
  });

  it(`should update firmwareValues when updateType = 2`, () => {
    component.selectedFirmware = {
      firmwareVersion: 'v26.08.2020-HF123'
    };
    component.firmwareValues = {
      devices: devicesListGrid,
      firmwareVersion: component.selectedFirmware.firmwareVersion
    };
    component.updateType = 2;
    spyOn(component, 'updateFirmware').and.callThrough();
    component.updateFirmware();
    expect(component.firmwareValues).toEqual(component.firmwareValues);
  });

  it(`updateSuccessMessage should be 'Global Level Firmware Update Initiated' when updateType is 0 - updateFirmware() `, () => {
    component.selectedFirmware = {
      firmwareVersion: 'v26.08.2020-HF123'
    };
    component.firmwareValues = {
      devices: devicesListGrid,
      firmwareVersion: component.selectedFirmware.firmwareVersion
    };
    component.updateType = 0;
    spyOn(component, 'updateFirmware').and.callThrough();
    component.updateFirmware();
    expect(component.updateSuccessMessage).toEqual('Global Level Firmware Update Initiated');
  });

  it(`updateSuccessMessage should be 'Firmware Update Initiated' when updateType is 3 - updateFirmware() `, () => {
    component.selectedFirmware = {
      firmwareVersion: 'v26.08.2020-HF123'
    };
    component.firmwareValues = {
      devices: devicesListGrid,
      firmwareVersion: component.selectedFirmware.firmwareVersion
    };
    component.updateType = 3;
    spyOn(component, 'updateFirmware').and.callThrough();
    component.updateFirmware();
    expect(component.updateSuccessMessage).toEqual('Firmware Update Initiated');
  });

  it('pageChange', () => {
    spyOn(component, 'pageChange').and.callThrough();
    component.pageChange(5);
    expect(component.pageChange).toHaveBeenCalled();
    expect(component.selectedPageNum).toBe(4, 'failed to set row selected with empty array');
  });

  it(`should call firmwareReleaseNotes`, () => {
    spyOn(component, 'firmwareReleaseNotes').and.callThrough();
    component.firmwareReleaseNotes(sampleFirmwareData);
    expect(component.firmwareReleaseNotes).toHaveBeenCalledWith(sampleFirmwareData);
  });

  it(`should call onCancelInstallation`, () => {
    spyOn(component, 'onCancelInstallation').and.callThrough();
    component.onCancelInstallation();
    expect(component.onCancelInstallation).toHaveBeenCalled();
  });

  it(`should call ngDoCheck`, () => {
    spyOn(component, 'ngDoCheck').and.callThrough();
    component.ngDoCheck();
    expect(component.ngDoCheck).toHaveBeenCalled();
  });
});
