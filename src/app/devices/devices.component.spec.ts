import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesComponent } from './devices.component';
import { DeviceGroupsResponse } from '../shared/models/deviceGroups.model';
import { DeviceService } from '../devices/device.service';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { devicesList, groupList } from '../../data/mockData/devicesAndGroups';
import { sampleConfigValues } from '../../data/mockData/configuration';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ConfigurationService } from '../configuration/configuration.service';

describe('DevicesComponent', () => {
  let component: DevicesComponent;
  let fixture: ComponentFixture<DevicesComponent>;
  let deviceService: DeviceService;
  let configurationService: ConfigurationService;
  const updateObj = {
    updateType: Number(0),
    updateContentType: Number(0)
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DevicesComponent],
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
            getDeviceDetails: (serial) => of(devicesList),
            getDeviceGroups: (param) => of(devicesList),
            deleteMultipleGroup: (groupsSelected) => of('success')
          }
        }, {
          provide: configurationService, useValue: {
            setUpdateType: (updateType) => of(),
            setDevicesList: (devicesSelected) => of(),
            setDevicesCount: (totalDeviceCount) => of(),
            getConfigValues: (id) => of(),
            getDefaultConfigValues: (id) => of(),
            resetValues: () => of(),
            updateConfigValues: (globalValues) => of('success')
          }
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesComponent);
    component = fixture.componentInstance;
    deviceService = TestBed.inject(DeviceService);
    configurationService = TestBed.inject(ConfigurationService);
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

  it('getDevices', () => {
    spyOn(component, 'getDevices').and.callThrough();
    component.getDevices();
    expect(component.getDevices).toHaveBeenCalled();
  });

  it('should get the list of devices', () => {
    component.getDevices();
    const params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '10')
      .set('sortDirection', 'ASC')
      .set('search', '')
      .set('searchTerm', '');
    expect(component.getDevices()).toEqual(devicesList[1]);
  });

  it('getGroups', () => {
    spyOn(component, 'getGroups').and.callThrough();
    component.getGroups();
    expect(component.getGroups).toHaveBeenCalled();
  });

  it('should get the list of groups', () => {
    component.getGroups();
    const params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '10')
      .set('sortDirection', 'ASC')
      .set('search', '')
      .set('searchTerm', '');
    expect(component.getGroups()).toEqual(groupList[1]);
  });

  it('searchDeviceList', () => {
    spyOn(component, 'getDevices').and.callThrough();
    component.getDevices();
    expect(component.getDevices).toHaveBeenCalled();
  });

  it('should get the field name for search term', () => {
    const fieldName = 'alias';
    component.searchInField = 'sample';
    component.selectField(fieldName);
    expect(component.searchInField).toBe('alias', 'failed to set name in searchInField');
  });

  it('should get the list of devices for the searched string', () => {
    component.getDevices();
    const params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '10')
      .set('sortDirection', 'ASC')
      .set('search', 'alias')
      .set('searchTerm', 'alias');
    expect(component.getDevices()).toEqual(devicesList[1]);
  });

  it('searchDeviceGroups', () => {
    spyOn(component, 'getGroups').and.callThrough();
    component.getGroups();
    expect(component.getGroups).toHaveBeenCalled();
  });

  it('searchDeviceGroups tobe called', () => {
    spyOn(component, 'searchDeviceGroups').and.callThrough();
    component.searchDeviceGroups('sample');
    expect(component.searchDeviceGroups).toHaveBeenCalled();
    expect(component.searchField).toBe('name');
    expect(component.selcetedGroupPageNum).toBe(0);
    expect(component.clearGroupsRowSelected).toBe(true);
  });

  it('should get the list of groups for the searched string', () => {
    component.getDevices();
    const params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '10')
      .set('sortDirection', 'ASC')
      .set('search', 'name')
      .set('searchTerm', 'P12_updated!');
    expect(component.getGroups()).toEqual(groupList[1]);
  });

  it('should call changeBooleanValue() from child component', () => {
    spyOn(component, 'changeBooleanValue').and.callThrough();
    component.changeBooleanValue();
    expect(component.changeBooleanValue).toHaveBeenCalled();
  });

  it('On checkForEmptyString() method expect following steps happens', () => {
    spyOn(component, 'checkForEmptyString').and.callThrough();
    component.checkForEmptyString('');
    expect(component.checkForEmptyString).toHaveBeenCalled();
    expect(component.searchTerm).toBe('', 'Failed to set searchTerm to empty value');
    expect(component.selcetedPageNum).toBe(0, 'Failed to set selectedPageNum to 0');
  });

  it('On checkForEmptyString() method expect else branch to be covered', () => {
    spyOn(component, 'checkForEmptyString').and.callThrough();
    component.checkForEmptyString('sekhar');
    expect(component.checkForEmptyString).toHaveBeenCalled();
  });

  it('On checkForEmptyStringGroups() method expect following steps happens', () => {
    spyOn(component, 'checkForEmptyStringGroups').and.callThrough();
    component.checkForEmptyStringGroups('');
    expect(component.checkForEmptyStringGroups).toHaveBeenCalled();
    expect(component.groupSearchTerm).toBe('', 'Failed to set groupSearchTerm to empty value');
    expect(component.selcetedGroupPageNum).toBe(0, 'Failed to set selectedGroupPageNum to 0');
  });

  it('On checkForEmptyStringGroups() method expect else branch to be covered', () => {
    spyOn(component, 'checkForEmptyStringGroups').and.callThrough();
    component.checkForEmptyStringGroups('sample search');
    expect(component.checkForEmptyStringGroups).toHaveBeenCalled();
  });

  it('should call pageChanged()', async(() => {
    spyOn(component, 'pageChanged').and.callThrough();
    spyOn(component, 'getDevices');
    component.pageChanged(1);
    fixture.detectChanges();
    expect(component.pageChanged).toHaveBeenCalled();
    expect(component.selcetedPageNum).toBe(0, 'failed to assign value 0 to selectedPageNum');
  }));

  it('should call selectedDevices() with event', () => {
    spyOn(component, 'selectedDevices').and.callThrough();
    component.selectedDevices('event');
    expect(component.selectedDevices).toHaveBeenCalled();
  });

  it('should call searchDeviceList() with search string', () => {
    component.searchTerm = 'sampleString';
    spyOn(component, 'searchDeviceList').and.callThrough();
    component.searchDeviceList('sampleString');
    expect(component.searchDeviceList).toHaveBeenCalled();
    expect(component.searchTerm).toBe('sampleString', 'failing to assign searchTerm to searchString');
  });

  it('should call createGroup()', () => {
    spyOn(component, 'createGroup').and.callThrough();
    component.createGroup();
    expect(component.createGroup).toHaveBeenCalled();
  });

  it('should toggle value of disableSearchFields on slectedGroupTab()', () => {
    component.slectedGroupTab();
    expect(component.disableSearchFields).toBe(true, 'failed to toggle the disableSearchFields flag');
  });

  it('should set disableSearchFields flag to false on slectedAllDevicesTab() function call', () => {
    component.slectedAllDevicesTab();
    expect(component.disableSearchFields).toBe(false, 'failed to toggle the disableSearchFields flag');
  });

  it('should call groupPageChanged()', async(() => {
    spyOn(component, 'groupPageChanged').and.callThrough();
    spyOn(component, 'getGroups');
    component.groupPageChanged(1);
    fixture.detectChanges();
    expect(component.groupPageChanged).toHaveBeenCalled();
    expect(component.selcetedGroupPageNum).toBe(0, 'failed to assign value 0 to selectedGroupPageNum');
    expect(component.configGroup.currentPage).toBe(1, 'failed to set configGroup.currentPage with 1');
  }));

  it('should call selectedGroups() with event as parameter', () => {
    spyOn(component, 'selectedGroups').and.callThrough();
    component.selectedGroups('event');
    expect(component.selectedGroups).toHaveBeenCalled();
  });

  it('should set showPopOverFlag to true on showPopOver() function call', () => {
    component.showPopOverFlag = false;
    component.showPopOver();
    expect(component.showPopOverFlag).toBe(true, 'Failed to set showPopOverFlag to true');
  });

  it('should call cancelChanges()', () => {
    spyOn(component, 'cancelChanges').and.callThrough();
    component.cancelChanges();
    expect(component.cancelChanges).toHaveBeenCalled();
  });

  it('should call updateDevices()', () => {
    spyOn(component, 'updateDevices').and.callThrough();
    component.updateDevices(updateObj);
    expect(component.updateDevices).toHaveBeenCalled();
  });

  it('should call showConfigurationModal()', () => {
    component.devicesSelected = [devicesList];
    spyOn(component, 'showConfigurationModal').and.callThrough();
    component.showConfigurationModal();
    expect(component.showConfigurationModal).toHaveBeenCalled();
  });

  it('should call updatedConfigValues()', () => {
    spyOn(component, 'updatedConfigValues').and.callThrough();
    component.updatedConfigValues(sampleConfigValues);
    expect(component.updatedConfigValues).toHaveBeenCalled();
  });

  it('should call updatedConfigValues()', () => {
    component.updateType = 0;
    spyOn(component, 'updatedConfigValues').and.callThrough();
    component.updatedConfigValues(sampleConfigValues);
    expect(component.updatedConfigValues).toHaveBeenCalled();
    expect(configurationService).toHaveBeenCalled();
  });

  it('searchInField value should be \'Location\' by default', () => {
    expect(component.searchInField).toBe('serial');
  });

  it('headding should be Device Management', () => {
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('.subheader'));
    expect(header.nativeElement.textContent).toBe('Device Management');
  });

  it('changeGroupBooleanValue() should set clearGroupsRowSelected to false', () => {
    spyOn(component, 'changeGroupBooleanValue').and.callThrough();
    component.changeGroupBooleanValue();
    expect(component.clearGroupsRowSelected ).toBe(false);
  });

  it('deleteGroup() should perform following functions', () => {
    fixture.destroy();
    spyOn(component, 'deleteGroup').and.callThrough();
    component.deleteGroup();
    expect(component.deleteGroup).toHaveBeenCalled();
  });

  it('should call selectedDates()', async(() => {
    const dates = {from: '1601251200000', to: '1601856000000', sortDirection : 'ASC'};
    spyOn(component, 'selectedDates').and.callThrough();
    component.selectedDates(dates);
    expect(component.selectedDates).toHaveBeenCalled();
  }));

  it('should open delete confirmation modal', () => {
    spyOn(component, 'showDeleteConfirmationModal').and.callThrough();
    component.showDeleteConfirmationModal();
    expect(component.showDeleteConfirmationModal).toHaveBeenCalled();
  });
});
