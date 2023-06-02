import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmwareComponent } from './firmware.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('FirmwareComponent', () => {
  let component: FirmwareComponent;
  let fixture: ComponentFixture<FirmwareComponent>;
  const sampleData = {
    changeLog: 'created for QA testing',
    checkSum: '17887',
    fileSize: '111MB',
    firmwareVersion: 'QA_1.0',
    installedOn: 0,
    packageLocation: 'newfolder_QA.tar',
    releaseDate: 4092020,
    s3BucketName: 'QA_Updated_fota1',
    signatureLocation: 'QA_1.sign',
    status: 'FAILED'
  };
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FirmwareComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmwareComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.firmwareData = sampleData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit data on onSelectReleseNotes function call', async(() => {
    spyOn(component.fnReleaseNotes, 'emit').and.callThrough();
    component.firmwareData = sampleData;
    component.onSelectReleaseNotes(sampleData);
    expect(component.fnReleaseNotes.emit).toHaveBeenCalled();
  }));

  it('should emit data on onSelectFirmWare function call', async(() => {
    component.firmwareData = sampleData;
    spyOn(component.fnUpdate, 'emit').and.callThrough();
    component.onSelectFirmWare(sampleData);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.fnUpdate.emit).toHaveBeenCalled();
    });
  }));

  it('should emit firmwareData on onCancel function on call', async(() => {
    component.firmwareData = sampleData;
    spyOn(component.fnCancel, 'emit').and.callThrough();
    component.onCancel(sampleData);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.fnCancel.emit).toHaveBeenCalled();
    });
  }));

  it('cancle button should be displayed when updateType is 2', async(() => {
    component.updateType = 2;
    component.firmwareData = sampleData;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#cancelButton'))).toBeFalsy();
    });
  }));

  it('should emit when the onReInstall function call', () => {
    spyOn(component.fnReInstall, 'emit').and.callThrough();
    component.updateType = 2;
    component.firmwareData = sampleData;
    fixture.detectChanges();
    component.onReInstall(sampleData);
    expect(component.fnReInstall.emit).toHaveBeenCalled();
  });
});
