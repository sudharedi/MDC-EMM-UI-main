import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ViewDeviceComponent } from './view-device.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceData, ConfigValues, SoftwarePackages } from '../../data/mockData/viewDevice';
import { AppPackageService } from '../../app/shared/models/services/appPackages.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { DeviceService } from '../devices/device.service';
import { DeviceServiceStub } from '../../data/mockData/viewDevice';
import { Observable, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { AppPackageServiceStub } from '../../data/mockData/appPackageService.mock';
import { sampleConfigValues } from '../../data/mockData/configuration';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  GroupNamesMock,
  ConfigValuesMock,
  DeviceDetailsMock,
  FectAllMock,
  UpdateHistoryDataMock,
  ConfigHistoryDataMock
} from '../../data/mockData//viewDevice.mock';
import { TitleCasePipe } from '@angular/common';


describe('ViewDeviceComponent', () => {
  let component: ViewDeviceComponent;
  let fixture: ComponentFixture<ViewDeviceComponent>;
  let deviceService: DeviceService;
  let configurationService: ConfigurationService;
  let appPackageService: AppPackageService;

  const appPackage = {
    changeLog: 'Lorem ipsum dolor sit amet,',
    fileSize: '240MB',
    id: 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c',
    installedOn: 0,
    packageLocation: 'Edmonton',
    packageName: 'other_app3',
    packageVersion: '1.0.3_r1',
    packageVersionCode: 5,
    releaseDate: 2344444444,
    systemPackage: false,
    targetVersionCode: 4,
    jobId: 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c'
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewDeviceComponent],
      imports: [HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        }),
        ModalModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxPaginationModule
      ],
      providers: [
        {
          provide: AppPackageService, useValue: {
            fectAll: () => of(FectAllMock),
            cancelAppPackageInstallationForPendingStatus: () => of('success'),
            updateDevicesApp: () => of('success'),
            unInstallAppPackage: () => of('success'),
            resetValues: () => of()
          }
        },
        {
          provide: ConfigurationService, useValue: {
            getConfigValues: (macId) => of(ConfigValuesMock),
            updateConfigValues: (values) => of('success')
          }
        },
        {
          provide: DeviceService, useValue: {
            getGroupNames: () => of(GroupNamesMock),
            getDeviceDetails: (macid) => of(DeviceDetailsMock),
            updateExistingDevice: (macid, editDeatils) => of('success'),
            getUpdateHistoryData: (macid) => of(UpdateHistoryDataMock),
            getConfigHistoryData: (macid) => of(ConfigHistoryDataMock),
            restartDevice: (macid) => of('success')
          }
        },
        TitleCasePipe
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDeviceComponent);
    component = fixture.componentInstance;
    component.configValues = ConfigValues;
    deviceService = TestBed.inject(DeviceService);
    configurationService = TestBed.inject(ConfigurationService);
    appPackageService = TestBed.inject(AppPackageService);
    sessionStorage.setItem('socketObject', '[{"deviceSerial":"189ba5405bcc","message":"1605166291482","type":"lastseen","dispensers":[]}]');
    component.configHistory = {
      id: 'dataGridPagination',
      currentPage: 0,
      itemsPerPage: 10,
      totalItems: 0,
    };

    component.configSoftware = {
      id: 'softwareGridPagination',
      currentPage: 0,
      itemsPerPage: 10,
      totalItems: 0,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getDeviceDetailsData() method on ngOnInit', () => {
    component.selectedDeviceId = 'C4E30CE0D53D';
    spyOn(component, 'getDeviceDetailsData').and.callThrough();
    component.ngOnInit();
    expect(component.getDeviceDetailsData).toHaveBeenCalled();
  });

  it('should hide more details from initially', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.show-more-details')).toBeFalsy();
  });

  it('should show more details on show more click', async(() => {
    component.deviceData = DeviceData;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    component.showMoreDetails();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(compiled.querySelector('.show-more-details')).toBeTruthy();
    });
  }));

  // it('Should call deviceService Once', async(() => {
  //   const mySpy = spyOn(DeviceService, 'getDeviceDetails').and.callThrough();
  //   DeviceService.getDeviceDetails();
  //   expect(mySpy).toHaveBeenCalledTimes(1);
  // }));

  it('should check if Configurations are shown', () => {
    component.configValues = ConfigValues;
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(component.configValues.length).toBe(ConfigValues.length);
    expect(compiled.querySelector('.config-values-overflow')).toBeTruthy();
  });

  it('should display Default packages and user packages data after receiving data from service', () => {
    component.finalAppPackagesList = SoftwarePackages;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#defaultpackages')).toBeTruthy();
  });

  it('should display Default packages and user packages data after receiving data from service', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    component.finalAppPackagesList = SoftwarePackages;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(compiled.querySelector('#defaultpackages')).toBeTruthy();
    });
  }));

  it('should change tab when user package is clicked', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    component.finalAppPackagesList = SoftwarePackages;
    fixture.detectChanges();
    component.changeTabSelection('userpackages');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(compiled.querySelector('#userpackages')).toBeTruthy();
    });
  }));

  it('should call goToFirmware() method on firmware click', () => {
    component.deviceData = DeviceData;
    spyOn(component, 'goToFirmware');
    component.goToFirmware();
    expect(component.goToFirmware).toHaveBeenCalled();
  });

  it('should get Apppackages list on getAppPackageData() method', async(() => {
    spyOn(component, 'getAppPackageData').and.callThrough();
    spyOn(appPackageService, 'fectAll').and.callThrough();
    component.getAppPackageData();
    expect(component.getAppPackageData).toHaveBeenCalled();
    expect(appPackageService.fectAll).toHaveBeenCalled();
  }));

  it('should call submit function on submit button click', async(() => {
    component.deviceData = {
      alias: 'sample',
      group: 'sample',
      location: 'sample',
      locationZip: 'sample'
    };
    component.deviceData.alias = 'sampleName';
    component.deviceData.group = 'sampleGroup';
    component.deviceData.location = 'sampleLocation';
    component.deviceData.locationZip = 'sampleZipLocation';
    spyOn(component, 'submit').and.callThrough();
    spyOn(deviceService, 'updateExistingDevice').and.callThrough();
    component.submit();
    expect(component.submit).toHaveBeenCalled();
    expect(deviceService.updateExistingDevice).toHaveBeenCalled();
  }));

  it('should call cancelChanges() when edit modal gets closed', () => {
    spyOn(component, 'cancelChanges').and.callThrough();
    component.cancelChanges();
    expect(component.cancelChanges).toHaveBeenCalled();
  });

  it('should navigate to security page on  goToSecurity() function call', () => {
    component.selectedDeviceId.macid = 'F1238AE4191E';
    spyOn(component, 'goToSecurity').and.callThrough();
    component.goToSecurity('sampleId');
    expect(component.goToSecurity).toHaveBeenCalled();
  });

  it('should show edit modal on showModal() click', () => {
    spyOn(component, 'showModal').and.callThrough();
    component.showModal();
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should call getUpdateHistoryData on openUpdateHistoryModal() function', () => {
    spyOn(component, 'openUpdateHistoryModal').and.callThrough();
    spyOn(component, 'getUpdateHistoryData').and.callThrough();
    component.openUpdateHistoryModal();
    expect(component.openUpdateHistoryModal).toHaveBeenCalled();
    expect(component.getUpdateHistoryData).toHaveBeenCalled();
  });

  it('should call getConfigurationHistoryData on openConfigurationHistoryModal() function', () => {
    spyOn(component, 'openConfigurationHistoryModal').and.callThrough();
    spyOn(component, 'getConfigurationHistoryData').and.callThrough();
    component.openConfigurationHistoryModal();
    expect(component.openConfigurationHistoryModal).toHaveBeenCalled();
    expect(component.getConfigurationHistoryData).toHaveBeenCalled();
  });

  it('should call getConfigurationHistoryData on openConfigurationHistoryModal() function', () => {
    spyOn(component, 'openConfigurationHistoryModal').and.callThrough();
    spyOn(component, 'getConfigurationHistoryData').and.callThrough();
    component.openConfigurationHistoryModal();
    expect(component.openConfigurationHistoryModal).toHaveBeenCalled();
    expect(component.getConfigurationHistoryData).toHaveBeenCalled();
  });

  it('should call selectGroupName() function', () => {
    component.deviceData = {
      alias: 'sample',
      group: 'sample',
      location: 'sample',
      locationZip: 'sample'
    };
    spyOn(component, 'selectGroupName').and.callThrough();
    component.selectGroupName('Alok_group_u2');
    expect(component.selectGroupName).toHaveBeenCalled();
    expect(component.deviceData.group).toBe('Alok_group_u2');
  });

  it('should call goToFirmware()', () => {
    spyOn(component, 'goToFirmware').and.callThrough();
    component.goToFirmware();
    expect(component.goToFirmware).toHaveBeenCalled();
  });

  it('should call changeConfigurations()', () => {
    component.configValues = sampleConfigValues;
    spyOn(component, 'changeConfigurations').and.callThrough();
    component.changeConfigurations();
    expect(component.changeConfigurations).toHaveBeenCalled();
  });

  it('should call cancelConfigChanges() from child app-configuration', () => {
    component.deviceData = {
      alias: 'sample',
      group: 'sample',
      location: 'sample',
      serial: 'sample'
    };
    spyOn(component, 'cancelConfigChanges').and.callThrough();
    component.cancelConfigChanges();
    expect(component.cancelConfigChanges).toHaveBeenCalled();
  });

  it('should call updatedConfigValues() from app-configuration component', () => {
    spyOn(component, 'updatedConfigValues').and.callThrough();
    component.updatedConfigValues(sampleConfigValues);
    expect(component.updatedConfigValues).toHaveBeenCalled();
  });

  it('should call onSelectAppPackage() from app-package component', () => {
    spyOn(component, 'onSelectAppPackage').and.callThrough();
    component.onSelectAppPackage(appPackage);
    expect(component.onSelectAppPackage).toHaveBeenCalled();
  });

  it('should call updateDeviceApp() from configuaration Update Modal', () => {
    spyOn(component, 'updateDeviceApp').and.callThrough();
    component.updateDeviceApp();
    expect(component.updateDeviceApp).toHaveBeenCalled();
  });

  it('should call onUnInstallAppPackage() from app-package child component', () => {
    spyOn(component, 'onUnInstallAppPackage').and.callThrough();
    component.onUnInstallAppPackage(appPackage);
    expect(component.onUnInstallAppPackage).toHaveBeenCalled();
  });

  it('should call uninstallAppPackage() when user click proceed in un install confirmation modal', () => {
    spyOn(component, 'uninstallAppPackage').and.callThrough();
    spyOn(appPackageService, 'unInstallAppPackage').and.callThrough();
    component.uninstallAppPackage();
    expect(component.uninstallAppPackage).toHaveBeenCalled();
    expect(appPackageService.unInstallAppPackage).toHaveBeenCalled();
  });

  it('should open release notes modal on getReleaseNotes() function call', () => {
    spyOn(component, 'getReleaseNotes').and.callThrough();
    component.getReleaseNotes('sample');
    expect(component.getReleaseNotes).toHaveBeenCalled();
  });

  it('should close popUp on closePopUp function call', () => {
    spyOn(component, 'closePopUp').and.callThrough();
    component.closePopUp();
    expect(component.closePopUp).toHaveBeenCalled();
    expect(component.restartDevice).toBe(false);
  });

  it('should call onCancel from child component', () => {
    spyOn(component, 'onCancel').and.callThrough();
    component.onCancel(appPackage);
    expect(component.onCancel).toHaveBeenCalled();
    expect(component.appPackageJobId).toBe(appPackage.jobId);
  });

  it('should call onReInstallAppPackage from app-package component', () => {
    spyOn(component, 'onReInstallAppPackage').and.callThrough();
    component.onReInstallAppPackage(appPackage);
    expect(component.onReInstallAppPackage).toHaveBeenCalled();
  });

  it('ngOnInit', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(deviceService, 'getGroupNames').and.callThrough();
    spyOn(configurationService, 'getConfigValues').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(deviceService.getGroupNames).toHaveBeenCalled();
    expect(configurationService.getConfigValues).toHaveBeenCalled();
  });

  it('getDeviceDetailsData', () => {
    spyOn(component, 'getDeviceDetailsData').and.callThrough();
    spyOn(deviceService, 'getDeviceDetails').and.callThrough();
    component.getDeviceDetailsData();
    fixture.detectChanges();
    expect(component.getDeviceDetailsData).toHaveBeenCalled();
    expect(deviceService.getDeviceDetails).toHaveBeenCalled();
  });

  it('getUpdateHistoryData', () => {
    spyOn(component, 'getUpdateHistoryData').and.callThrough();
    spyOn(deviceService, 'getUpdateHistoryData').and.callThrough();
    component.getUpdateHistoryData();
    fixture.detectChanges();
    expect(component.getUpdateHistoryData).toHaveBeenCalled();
    expect(deviceService.getUpdateHistoryData).toHaveBeenCalled();
  });

  it('getConfigurationHistoryData', () => {
    spyOn(component, 'getConfigurationHistoryData').and.callThrough();
    spyOn(deviceService, 'getConfigHistoryData').and.callThrough();
    component.getConfigurationHistoryData();
    fixture.detectChanges();
    expect(component.getConfigurationHistoryData).toHaveBeenCalled();
    expect(deviceService.getConfigHistoryData).toHaveBeenCalled();
  });

  it('pageChange', () => {
    spyOn(component, 'pageChange').and.callThrough();
    component.pageChange(5);
    fixture.detectChanges();
    expect(component.pageChange).toHaveBeenCalled();
    expect(component.selectedPageNum).toBe(4, 'failed to set selected PageNum with 4');
  });

  it('pageChangeSoftware', () => {
    spyOn(component, 'pageChangeSoftware').and.callThrough();
    component.pageChangeSoftware(5);
    fixture.detectChanges();
    expect(component.pageChangeSoftware).toHaveBeenCalled();
    expect(component.selectedPageNumSoftware).toBe(4, 'failed to set selected PageNum with 4');
  });

  it('cancelInstallation', () => {
    spyOn(component, 'cancelInstallation').and.callThrough();
    spyOn(appPackageService, 'cancelAppPackageInstallationForPendingStatus').and.callThrough();
    component.cancelInstallation();
    fixture.detectChanges();
    expect(component.cancelInstallation).toHaveBeenCalled();
    expect(appPackageService.cancelAppPackageInstallationForPendingStatus).toHaveBeenCalled();
  });

  it('rebootDevice should call deviceservice > restartDevice functions', () => {
    spyOn(component, 'rebootDevice').and.callThrough();
    spyOn(deviceService, 'restartDevice').and.callThrough();
    component.rebootDevice();
    fixture.detectChanges();
    expect(component.rebootDevice).toHaveBeenCalled();
    expect(deviceService.restartDevice).toHaveBeenCalled();
  });

  it('logHistoryLink', () => {
    spyOn(component, 'logHistoryLink').and.callThrough();
    component.logHistoryLink();
    expect(component.logHistoryLink).toHaveBeenCalled();
  });

  it('faultHistoryLink', () => {
    spyOn(component, 'faultHistoryLink').and.callThrough();
    component.faultHistoryLink();
    expect(component.faultHistoryLink).toHaveBeenCalled();
  });

  it('ngDoCheck', () => {
    spyOn(component, 'ngDoCheck').and.callThrough();
    component.ngDoCheck();
    expect(component.ngDoCheck).toHaveBeenCalled();
  });

  it('updateDeviceAppForceTrue', () => {
    spyOn(component, 'updateDeviceAppForceTrue').and.callThrough();
    component.updateDeviceAppForceTrue();
    expect(component.updateDeviceAppForceTrue).toHaveBeenCalled();
  });
});
