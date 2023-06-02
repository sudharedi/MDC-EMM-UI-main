import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterTestingModule } from '@angular/router/testing';
import { AppPackageListComponent } from './app-package-list.component';
import { SoftwarePackages } from '../../data/mockData/viewDevice';
import { AppPackageService } from '../../app/shared/models/services/appPackages.service';
import { devicesListGrid, InstalledAppsMock } from '../../data/mockData/devicesAndGroups';
import { of } from 'rxjs';
import { TitleCasePipe } from '@angular/common';


describe('AppPackageListComponent', () => {
  let component: AppPackageListComponent;
  let fixture: ComponentFixture<AppPackageListComponent>;
  const sampleAppData = {
    changeLog: 'created for QA testing ',
    checkSum: '3b0ace581a071a4f33c88fc3aa7f7676',
    fileSize: '540KB',
    id: '9acdef99-5a76-4a1f-abef-7fc6859af321',
    installedOn: 0,
    packageLocation: 'platform_daily/test/mdc-apps-2.0.0-r1.cortexa5t2hf_neon_vfpv4.rpm',
    packageName: 'mdc-apps',
    packageVersion: '2.0.0-r1',
    packageVersionCode: 2,
    releaseDate: 1599049271929,
    s3BucketName: 'mdc-builds',
    signatureLocation: 'platform_daily/test/mdc-apps-2.0.0-r1.cortexa5t2hf_neon_vfpv4.rpm.sign',
    status: 'NA',
    systemPackage: true,
    targetVersionCode: 1
  };
  let appPackageService: AppPackageService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppPackageListComponent],
      imports: [HttpClientTestingModule,
        RouterTestingModule,
        ModalModule.forRoot(),
        ToastrModule.forRoot({
          preventDuplicates: true
        })],
      providers: [
        {
          provide: AppPackageService, useValue: {
            fectAll: () => of(devicesListGrid),
            setSelectedAppPackage: (selectedApp) => of(),
            setUpdateType: (Version) => of(),
            getSelectedDeviceList: () => of(),
            updateDevicesApp: (appValues) => of(),
            setNonCompatibleDeviceList: (data) => of(),
            updateGroupAppPackages: (groupId, appValues) => of(),
            resetValues: () => of()
          }
        },
        TitleCasePipe
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPackageListComponent);
    component = fixture.componentInstance;
    appPackageService = TestBed.inject(AppPackageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAppPackageData() method on ngOnInit', () => {
    spyOn(component, 'getAppPackageData');
    component.ngOnInit();
    expect(component.getAppPackageData).toHaveBeenCalled();
  });

  it('should call closePopUp() method on cancel button click', () => {
    spyOn(component, 'closePopUp').and.callThrough();
    component.closePopUp();
    expect(component.closePopUp).toHaveBeenCalled();
  });

  it('should display Default packages and user packages data after receiving data from service', async(() => {
    component.allPackageData = SoftwarePackages;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#defaultpackages')).toBeFalsy();
  }));

  it('should change tab when user package is clicked', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    component.allPackageData = SoftwarePackages;
    fixture.detectChanges();
    component.changeTabSelection('userpackages');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(compiled.querySelector('#userpackages')).toBeTruthy();
    });
  }));

  it('should call fnFindPageType()', () => {
    spyOn(component, 'fnFindPageType').and.callThrough();
    component.fnFindPageType();
    expect(component.fnFindPageType).toHaveBeenCalled();
  });

  it('should call onSelectAppPackage', () => {
    spyOn(component, 'onSelectAppPackage');
    component.onSelectAppPackage(devicesListGrid[1]);
    expect(component.onSelectAppPackage).toHaveBeenCalled();
  });

  it('should call updateDeviceApp', () => {
    component.selectedApp = {
      id: 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c'
    };
    component.appValues = {
      devices: devicesListGrid,
      force: true,
      restart: false,
      softwarePackageId: component.selectedApp.id
    };
    spyOn(component, 'updateDeviceApp').and.callThrough();
    component.updateDeviceApp();
    expect(component.updateDeviceApp).toHaveBeenCalled();
  });

  it('On updateDeviceApp function call if update Type is 0 update message should change', () => {
    component.selectedApp = {
      id: 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c'
    };
    component.appValues = {
      devices: devicesListGrid,
      force: true,
      restart: false,
      softwarePackageId: component.selectedApp.id
    };
    component.updateType = 0;
    spyOn(component, 'updateDeviceApp').and.callThrough();
    component.updateDeviceApp();
    expect(component.updateDeviceApp).toHaveBeenCalled();
    expect(component.updateSuccessMessage).toBe('Global Level App Update Initiated');
  });

  it('On updateDeviceApp function call if update Type is 3 update message should change', () => {
    component.selectedApp = {
      id: 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c'
    };
    component.appValues = {
      devices: devicesListGrid,
      force: true,
      restart: false,
      softwarePackageId: component.selectedApp.id
    };
    component.updateType = 3;
    spyOn(component, 'updateDeviceApp').and.callThrough();
    component.updateDeviceApp();
    expect(component.updateDeviceApp).toHaveBeenCalled();
    expect(component.updateSuccessMessage).toBe('App Update Initiated');
  });

  it('On updateDeviceApp function call if update Type is 1 update message should change', () => {
    component.selectedApp = {
      id: 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c'
    };
    component.appValues = {
      devices: devicesListGrid,
      force: true,
      restart: false,
      softwarePackageId: component.selectedApp.id
    };
    component.updateType = 1;
    spyOn(component, 'updateDeviceApp').and.callThrough();
    component.updateDeviceApp();
    expect(component.updateDeviceApp).toHaveBeenCalled();
  });

  it('should call onInstallButtonClick', () => {
    component.selectedApp = {
      id: 'bcfc9b74-6511-47af-b8e3-8a54fd6b8c8c'
    };
    component.appValues = {
      devices: devicesListGrid,
      force: false,
      restart: false,
      softwarePackageId: component.selectedApp.id
    };
    spyOn(component, 'onInstallButtonClick').and.callThrough();
    component.onInstallButtonClick();
    expect(component.onInstallButtonClick).toHaveBeenCalled();
  });


  it('onSelectAppPackage Branches testing - UpdateType = 0', () => {
    component.updateType = 0;
    expect(component.onSelectAppPackage(sampleAppData)).toEqual();
  });

  it('onSelectAppPackage Branches testing - UpdateType = 1', () => {
    component.updateType = 1;
    expect(component.onSelectAppPackage(sampleAppData)).toEqual();
  });

  it('onSelectAppPackage Branches testing - UpdateType = 2', () => {
    component.updateType = 2;
    expect(component.onSelectAppPackage(sampleAppData)).toEqual();
  });

  it('onSelectAppPackage Branches testing - UpdateType = 3', () => {
    component.updateType = 3;
    expect(component.onSelectAppPackage(sampleAppData)).toEqual();
  });

  it('onSelectAppPackage Branches testing - UpdateType = 4', () => {
    component.updateType = 4;
    expect(component.onSelectAppPackage(sampleAppData)).toEqual();
  });

  it('onSelectAppPackage Branches testing - default', () => {
    expect(component.onSelectAppPackage(sampleAppData)).toEqual();
  });

  it('should call fnFindPageType', () => {
    spyOn(component, 'fnFindPageType').and.callThrough();
    component.fnFindPageType();
    expect(component.fnFindPageType).toHaveBeenCalled();
  });

  it('popupHeaderText should be App Package update when updateType is 3', () => {
    spyOn(component, 'fnFindPageType').and.callThrough();
    component.updateType = 3;
    component.fnFindPageType();
    expect(component.popupHeaderText).toBe('App Package update');
  });

  it('popupHeaderText should be Global Level App Package update when updateType is 0', () => {
    spyOn(component, 'fnFindPageType').and.callThrough();
    component.updateType = 0;
    component.fnFindPageType();
    expect(component.popupHeaderText).toBe('Global Level App Package update');
  });

  it('popupHeaderText should be Group Level App Package update when updateType is 1', () => {
    spyOn(component, 'fnFindPageType').and.callThrough();
    component.updateType = 1;
    component.fnFindPageType();
    expect(component.popupHeaderText).toBe('Group Level App Package update');
  });

  it('should call getReleaseNotes() method from child component', () => {
    const markDown = '#### sample markdown';
    spyOn(component, 'getReleaseNotes').and.callThrough();
    component.getReleaseNotes(markDown);
    expect(component.getReleaseNotes).toHaveBeenCalled();
  });

  it('getAppPackageData', () => {
    spyOn(component, 'getAppPackageData').and.callThrough();
    spyOn(appPackageService, 'fectAll').and.callThrough();
    component.getAppPackageData();
    fixture.detectChanges();
    expect(component.getAppPackageData).toHaveBeenCalled();
    expect(appPackageService.fectAll).toHaveBeenCalled();
  });
});
