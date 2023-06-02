import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CreateGroupComponent } from './create-group.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { ToastrModule } from 'ngx-toastr';
import { DeviceService } from '../devices/device.service';
import { BaseService } from '../base-service.service';
import { DataGridComponent } from '../devices/data-grid/data-grid.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { devicesList, groupDetails, UnassignedDevicesMock, rowSelected } from '../../data/mockData/devicesAndGroups';
import { of } from 'rxjs';

describe('CreateGroupComponent', () => {
  let component: CreateGroupComponent;
  let fixture: ComponentFixture<CreateGroupComponent>;
  let deviceService: DeviceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateGroupComponent,
        DataGridComponent],
      imports: [HttpClientTestingModule,
        RouterTestingModule,
        NgxPaginationModule,
        Ng2SearchPipeModule,
        Ng2OrderModule,
        ModalModule.forRoot(),
        ToastrModule.forRoot({
          preventDuplicates: true
        })],
      providers: [
        {
        provide: DeviceService, useValue: {
          getUnassignedDevices: (params) => of(UnassignedDevicesMock),
          createNewGroup: (groupDetailss) => of('successMock'),
          addDevicesToGroup: (groupId, selectedDeviceListToTable) => of('success'),
          updateGroupData: (groupId, value) => of('success'),
          removeDevicesFromGroup: (groupId, deviceListInAGroup) => of(),
          deleteGroup: (groupId) => of('success'),
          getDeviceListInAGroup: (groupId) => of(devicesList),
          getGroupDetailsByGroupId: (groupId) => of('success'),
        }
      },
        BaseService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGroupComponent);
    component = fixture.componentInstance;
    deviceService = TestBed.inject(DeviceService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in a h2 tag', async(() => {
    const createdCompoenet = TestBed.createComponent(CreateGroupComponent);
    component.isEditScreen = false;
    createdCompoenet.detectChanges();
    const compiled = createdCompoenet.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Create Group');
  }));

  it('should call getDevices Method from create group', () => {
    spyOn(component, 'getDevices').and.callThrough();
    component.ngOnInit();
    expect(component.getDevices).toHaveBeenCalled();
  });

  it('should call getDevices Method from create group', () => {
    component.searchTerm = 'sample term';
    spyOn(component, 'getDevices').and.callThrough();
    component.getDevices();
    expect(component.getDevices).toHaveBeenCalled();
  });

  it('getDevices', () => {
    spyOn(component, 'getDevices').and.callThrough();
    spyOn(deviceService, 'getUnassignedDevices').and.callThrough();
    component.selectedDeviceListToTable = [{}, {}];
    component.getDevices();
    fixture.detectChanges();
    expect(component.getDevices).toHaveBeenCalled();
    expect(deviceService.getUnassignedDevices).toHaveBeenCalled();
  });

  it('getDeviceListInAGroup', () => {
    spyOn(component, 'getDeviceListInAGroup').and.callThrough();
    spyOn(deviceService, 'getDeviceListInAGroup').and.callThrough();
    component.getDeviceListInAGroup();
    fixture.detectChanges();
    expect(component.getDeviceListInAGroup).toHaveBeenCalled();
    expect(deviceService.getDeviceListInAGroup).toHaveBeenCalled();
  });

  it('deleteDeviceFromGroup', () => {
    spyOn(component, 'deleteDeviceFromGroup').and.callThrough();
    component.selectedDeviceListToTable = [{}, {}];
    component.deleteDeviceFromGroup('deleteRows');
    fixture.detectChanges();
    expect(component.deleteDeviceFromGroup).toHaveBeenCalled();
  });

  it('ngOnInit', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'getDeviceListInAGroup');
    spyOn(component, 'getGroupDetails');
    component.groupDetails.groupId = 'sampleId';
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(component.getDeviceListInAGroup).toHaveBeenCalled();
    expect(component.getGroupDetails).toHaveBeenCalled();
  });

  it('should get the list of unassigned devices', () => {
    component.getDevices();
    expect(component.getDevices()).toEqual(devicesList[1]);
  });

  it('onDelete Group', () => {
    spyOn(component, 'deleteGroup').and.callThrough();
    component.deleteGroup();
    expect(component.deleteGroup).toHaveBeenCalled();
  });

  it('should call getGroupDetails method', () => {
    component.groupDetails.groupId = '35e599af-4891-4953-a956-8a31bc92c300';
    component.isEditScreen = true;
    spyOn(component, 'getGroupDetails').and.callThrough();
    component.getGroupDetails();
    expect(component.getGroupDetails).toHaveBeenCalled();
  });

  it('should get GroupDetails', () => {
    spyOn(component, 'getGroupDetails').and.callThrough();
    component.getGroupDetails();
    expect(component.getGroupDetails()).toEqual(groupDetails[1]);
  });

  it('On showDeleteConfirmationModal() method expect function to be called', () => {
    spyOn(component, 'showDeleteConfirmationModal').and.callThrough();
    component.showDeleteConfirmationModal();
    expect(component.showDeleteConfirmationModal).toHaveBeenCalled();
  });

  it('On checkForEmptyString() method expect function to be called', () => {
    spyOn(component, 'checkForEmptyString').and.callThrough();
    spyOn(component, 'getDevices');
    component.checkForEmptyString('');
    expect(component.checkForEmptyString).toHaveBeenCalled();
    expect(component.searchTerm).toBe('', 'failed to set search term to empty string');
    expect(component.selcetedPageNum).toBe(0, 'failed to set selcetedPageNum to 0');
    expect(component.getDevices).toHaveBeenCalled();
  });

  it('On checkForEmptyString() method else branch', () => {
    spyOn(component, 'checkForEmptyString').and.callThrough();
    component.checkForEmptyString('sampleString');
    expect(component.checkForEmptyString).toHaveBeenCalled();
  });

  it('On selectField() expect search in field name to be set', () => {
    spyOn(component, 'selectField').and.callThrough();
    component.selectField('sampleName');
    expect(component.selectField).toHaveBeenCalled();
    expect(component.searchInField).toBe('sampleName', 'failed to set search term with sampleName');
  });

  it('On searchDeviceList() expect searchTerm field name to be set', () => {
    spyOn(component, 'searchDeviceList').and.callThrough();
    spyOn(component, 'getDevices');
    component.searchDeviceList('sampleName');
    expect(component.searchDeviceList).toHaveBeenCalled();
    expect(component.searchTerm).toBe('sampleName', 'failed to set search term with sampleName');
    expect(component.getDevices).toHaveBeenCalled();
  });

  it('On selectedDevicesPageChange() expect to be called', () => {
    spyOn(component, 'selectedDevicesPageChange').and.callThrough();
    component.selectedDevicesPageChange(2);
    expect(component.selectedDevicesPageChange).toHaveBeenCalled();
  });

  it('should call pageChanged() function', () => {
    spyOn(component, 'pageChanged').and.callThrough();
    spyOn(component, 'getDevices');
    component.pageChanged(2);
    expect(component.pageChanged).toHaveBeenCalled();
    expect(component.selcetedPageNum ).toBe(1, 'failed to set selected page number to 1');
    expect(component.getDevices).toHaveBeenCalled();
  });

  it('should call updateGroup() function', () => {
    spyOn(component, 'updateGroup').and.callThrough();
    component.groupDetails.groupId = 'sampleId';
    component.updateGroup('CreateGroup');
    expect(component.updateGroup).toHaveBeenCalled();
  });

  it('should call updateGroup() function if branch', () => {
    spyOn(component, 'updateGroup').and.callThrough();
    component.groupDetails.groupId = 'sampleId';
    component.updateGroup(0);
    expect(component.updateGroup).toHaveBeenCalled();
  });

  it('should call updateGroup() function else branch', () => {
    spyOn(component, 'updateGroup').and.callThrough();
    component.groupDetails.groupId = 'sampleId';
    component.updateGroup(1);
    expect(component.updateGroup).toHaveBeenCalled();
  });

  it('should call removeDevicesFromGroup() function', () => {
    spyOn(component, 'removeDevicesFromGroup');
    component.groupDetails.groupId = 'sampleId';
    component.removeDevicesFromGroup();
    expect(component.removeDevicesFromGroup).toHaveBeenCalled();
  });

  it('should call toggleRow() function', () => {
    spyOn(component, 'toggleRow').and.callThrough();
    component.toggleRow('event');
    expect(component.toggleRow).toHaveBeenCalled();
  });

  it('should call selectedDevicesToGroup() function', () => {
    spyOn(component, 'selectedDevicesToGroup').and.callThrough();
    component.selectedDevicesToGroup(devicesList);
    expect(component.selectedDevicesToGroup).toHaveBeenCalled();
  });

  it('should call cancelChanges() function', () => {
    component.deviceListInAGroup = [
      {
        checked: true
      },
      {
        checked: true
      }
    ];
    spyOn(component, 'cancelChanges').and.callThrough();
    component.cancelChanges();
    expect(component.cancelChanges).toHaveBeenCalled();
  });
});
