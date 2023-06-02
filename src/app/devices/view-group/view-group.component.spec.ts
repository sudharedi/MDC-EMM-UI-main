import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGroupComponent } from './view-group.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DeviceService } from '../device.service';
import { Observable, Subject, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import {
  devicesList,
  devicesListGrid,
  DevicesListMock,
  groupDetails,
  groupList, rowSelected, singleDevice
} from 'src/data/mockData/devicesAndGroups';
import { sampleConfigValues, configurationValues } from '../../../data/mockData/configuration';
import { ConfigurationService } from 'src/app/configuration/configuration.service';
import { CommonModule } from '@angular/common';
import { AppPackageService } from '../../shared/models/services/appPackages.service';

describe('ViewGroupComponent', () => {
  let component: ViewGroupComponent;
  let fixture: ComponentFixture<ViewGroupComponent>;
  // const mockRouter = {
  //   params: new Subject<any>(),
  // }
  let deviceService: DeviceService;
  let configurationService: ConfigurationService;
  let appPackageService: AppPackageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGroupComponent ],
      imports: [HttpClientTestingModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        }),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot()],
        providers: [
          {
            provide: DeviceService, useValue: {
              getDevices: () => of(devicesList),
              getGroupDetailsByGroupId: (groupId) => of(
                {
                  createdOn: 1598942482905,
                  deviceCount: 2,
                  id: '70846d1a-1f69-47f9-80d5-6d2bf6a5e292',
                  name: 'new_test',
                }
              ),
              getGroupDevicesByGroupId: (groupId) => of(devicesList)
            }
          },
          {
            provide: ConfigurationService, useValue: {
              setUpdateType: () => of(),
              setDevicesList: () => of(),
              setDevicesCount: () => of(),
              getConfigValues: (id) => of(sampleConfigValues),
              getDefaultConfigValues: () => of(configurationValues),
              updateGroupsConfigValues: (groupId, groupLevelUpdate) => of('success'),
              resetValues: () => of(),
              updateConfigValue: () => of(),
              updateConfigValues: () => of('success')
            }
          },
          {
            provide: AppPackageService, useValue: {
              setGroupId: (groupId) => of()
            }
          }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGroupComponent);
    component = fixture.componentInstance;
    deviceService = TestBed.inject(DeviceService);
    configurationService = TestBed.inject(ConfigurationService);
    appPackageService = TestBed.inject(AppPackageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    let selectedGroup = '';
    const router = TestBed.get(ActivatedRoute);
    router.params.subscribe({ id: '35e599af-4891-4953-a956-8a31bc92c300' });
    selectedGroup = router.params.id;
    fixture.detectChanges();

    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('getDevices', () => {
    spyOn(component, 'getDevices').and.callThrough();
    spyOn(deviceService, 'getGroupDevicesByGroupId').and.callThrough();
    component.getDevices();
    expect(deviceService.getGroupDevicesByGroupId).toHaveBeenCalled();
    expect(component.getDevices).toHaveBeenCalled();
  });

  it('should get the list of devices belongs to the selected group', () => {
    component.getDevices();
    expect(component.getDevices()).toEqual(devicesList[1]);
  });

  it('getGroupDetails', () => {
    spyOn(component, 'getGroupDetails').and.callThrough();
    component.getGroupDetails();
    expect(component.getGroupDetails).toHaveBeenCalled();
  });

  it('should get the group details for the selected group', () => {
    component.getGroupDetails();
    expect(component.getGroupDetails()).toEqual(groupDetails[1]);
  });

  it('pageChanged', () => {
    const pageNumber = 1;
    spyOn(component, 'pageChanged').and.callThrough();
    component.pageChanged(pageNumber);
    expect(component.pageChanged).toHaveBeenCalled();
  });

  it('should get the group details for the selected page number', () => {
    const pageNumber = 1;
    component.pageChanged(pageNumber);
    expect(component.getDevices()).toEqual(devicesList[1]);
  });

  it('should get the list of selected group from the grid', () => {
    const devicesSelected = groupDetails;
    component.selectedDevices(devicesSelected);
  });

  it('On showPopOver() method expect function to be called', () => {
    component.showPopOverFlag = false;
    spyOn(component, 'showPopOver').and.callThrough();
    component.showPopOver();
    expect(component.showPopOver).toHaveBeenCalled();
    expect(component.showPopOverFlag).toBe(true, 'failed to set showPopOverFlag flag to true');
  });

  it('On showConfigurationModal() method expect function to be called', () => {
    component.devicesSelected = singleDevice;
    spyOn(component, 'showConfigurationModal').and.callThrough();
    component.showConfigurationModal();
    expect(component.showConfigurationModal).toHaveBeenCalled();
  });

  it('showConfigurationModal() else path testing', () => {
    component.devicesSelected = devicesListGrid;
    spyOn(component, 'showConfigurationModal').and.callThrough();
    component.showConfigurationModal();
    expect(component.showConfigurationModal).toHaveBeenCalled();
  });

  it('on changeBooleanValue() expect funtion to be called', () => {
    spyOn(component, 'changeBooleanValue').and.callThrough();
    component.changeBooleanValue();
    expect(component.changeBooleanValue).toHaveBeenCalled();
    expect(component.clearRowSelected).toBe(false, 'failed to set clearRowSelected flag to false');
  });

  it('on updatedConfigValues() expect funtion to be called', () => {
    component.updateType = 0;
    spyOn(component, 'updatedConfigValues').and.callThrough();
    component.updatedConfigValues(sampleConfigValues);
    expect(component.updatedConfigValues).toHaveBeenCalled();
  });

  it('on updatedConfigValues() expect funtion to be called', () => {
    component.updateType = 1;
    spyOn(component, 'updatedConfigValues').and.callThrough();
    component.updatedConfigValues(sampleConfigValues);
    expect(component.updatedConfigValues).toHaveBeenCalled();
  });

  it('on cancelConfigChanges() expect funtion to be called', () => {
    spyOn(component, 'cancelConfigChanges').and.callThrough();
    component.cancelConfigChanges();
    expect(component.cancelConfigChanges).toHaveBeenCalled();
  });

  it('getGroupDetails', () => {
    spyOn(component, 'getGroupDetails').and.callThrough();
    spyOn(deviceService, 'getGroupDetailsByGroupId').and.callThrough();
    component.getGroupDetails();
    fixture.detectChanges();
    expect(component.getGroupDetails).toHaveBeenCalled();
    expect(deviceService.getGroupDetailsByGroupId).toHaveBeenCalled();
  });

  it('showConfigurationModal', () => {
    spyOn(component, 'showConfigurationModal').and.callThrough();
    spyOn(configurationService, 'getConfigValues').and.callThrough();
    component.devicesSelected = [{}];
    component.showConfigurationModal();
    fixture.detectChanges();
    expect(component.showConfigurationModal).toHaveBeenCalled();
    expect(configurationService.getConfigValues).toHaveBeenCalled();
  });

  it('showConfigurationModal checking for else condition', () => {
    spyOn(component, 'showConfigurationModal').and.callThrough();
    spyOn(configurationService, 'getDefaultConfigValues').and.callThrough();
    component.devicesSelected = [{}, {}];
    component.showConfigurationModal();
    fixture.detectChanges();
    expect(component.showConfigurationModal).toHaveBeenCalled();
    expect(configurationService.getDefaultConfigValues).toHaveBeenCalled();
  });

  it('on editGroup should navigate to editGroup page', () => {
    spyOn(component, 'editGroup').and.callThrough();
    component.selectedGroup.groupId = 'sampleId';
    component.editGroup();
    expect(component.editGroup).toHaveBeenCalled();
  });

  it('On updateDevices() method expect function to be called', () => {
    const event = {updateContentType: 0, updateType: 1};
    spyOn(component, 'updateDevices').and.callThrough();
    component.updateDevices(event);
    expect(component.updateDevices).toHaveBeenCalled();
  });

  it('On updateDevices() method expect function to be called', () => {
    const event = {updateContentType: 1, updateType: 1};
    spyOn(component, 'updateDevices').and.callThrough();
    component.updateDevices(event);
    expect(component.updateDevices).toHaveBeenCalled();
  });

  it('On updateDevices() method expect function to be called', () => {
    const event = {updateContentType: 2, updateType: 1};
    spyOn(component, 'updateDevices').and.callThrough();
    component.updateDevices(event);
    expect(component.updateDevices).toHaveBeenCalled();
  });
});
