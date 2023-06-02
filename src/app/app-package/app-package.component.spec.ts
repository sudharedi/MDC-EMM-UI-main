import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPackageComponent } from './app-package.component';
import { AppPackageServiceStub } from '../../data/mockData/appPackageService.mock';

describe('AppPackagesComponent', () => {
  let component: AppPackageComponent;
  let fixture: ComponentFixture<AppPackageComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppPackageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPackageComponent);
    component = fixture.componentInstance;
    component.packagesData = AppPackageServiceStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit App package on onSelectReleaseNotes function call', async(() => {
    spyOn(component.fnReleaseNotes, 'emit').and.callThrough();
    component.onSelectReleaseNotes(AppPackageServiceStub[0]);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.fnReleaseNotes.emit).toHaveBeenCalled();
    });
  }));

  it('should emit App package on onSelectApp function call', async(() => {
    spyOn(component.fnUpdate, 'emit').and.callThrough();
    component.onSelectApp(AppPackageServiceStub[1]);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.fnUpdate.emit).toHaveBeenCalled();
    });
  }));

  it('should emit App package to parent component onUnInstallApp() function call', async(() => {
    spyOn(component.fnUnInstall, 'emit').and.callThrough();
    component.onUnInstallApp(AppPackageServiceStub[1]);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.fnUnInstall.emit).toHaveBeenCalled();
    });
  }));

  it('should emit packageData to parent component onReInstall() function call', async(() => {
    spyOn(component.fnReInstall, 'emit').and.callThrough();
    component.onReInstall(AppPackageServiceStub[1]);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.fnReInstall.emit).toHaveBeenCalled();
    });
  }));

  it('should emit packageData to parent component onCancel() function call', async(() => {
    spyOn(component.fnCancel, 'emit').and.callThrough();
    component.onCancel(AppPackageServiceStub[1]);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.fnCancel.emit).toHaveBeenCalled();
    });
  }));

  it('should check following ngOnInit() function call', async(() => {
    component.pageType = 'globalAppPackage';
    component.ngOnInit();
    expect(component.versionColumn).toBe(true);
    expect(component.sizeColumn).toBe(true);
    expect(component.packageColumn).toBe(false);
  }));

  it('should check following ngOnInit() function call', async(() => {
    component.pageType = 'userAppPackage';
    component.ngOnInit();
    expect(component.versionColumn).toBe(false);
    expect(component.sizeColumn).toBe(true);
    expect(component.packageColumn).toBe(true);
  }));
});
