import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DeviceService } from '../devices/device.service';
import { BaseComponent } from '../base-component.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DeviceListResponse } from '../shared/models/device.model';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GroupActions} from '../../app/shared/models/update.type';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css'],
})
export class CreateGroupComponent extends BaseComponent
  implements OnInit, OnDestroy {
  @ViewChild('deleteConfirmatopnModal', { static: false }) deleteConfirmatopnModal: ModalDirective;
  devicesList: any = [];
  rowSelectedToGroup: any = [];
  unassignedDevicesPaginationConfig: any;
  selectedDevicesPaginationConfig: any;
  noOfElements: number;
  selectedDeviceList: any = [];
  selectedDeviceListToTable: any = [];

  selcetedPageNum: any = 0;
  sortDirection = 'ASC';

  sortKeys = 'macid';
  tableColumnHeaders = {
    checkboxSelection: true,
    macid: true,
    group: false,
    enrolled_on: true,
    location: true,
    status: true,
    uptime: false,
    warning: false,
    action: false,
  };
  showSelectButton = true;
  showRemoveButton = true;
  showPagination: boolean;

  groupName;

  macidList = [];
  searchTerm: any = '';
  searchInField = 'location';
  selectedGroupName;
  deviceListInAGroup;
  isEditScreen = false;
  groupId;
  groupDetails;
  currentGroupName;

  constructor(
    private deviceService: DeviceService,
    private router: Router,
    private toastrService: ToastrService,
    private route: ActivatedRoute
  ) {
    super();
    this.unassignedDevicesPaginationConfig = {
      id: 'dataGridPagination',
      currentPage: 0,
      itemsPerPage: 10,
      totalItems: 0,
    };
    this.selectedDevicesPaginationConfig = {
      id: 'selectedDevicesPagination',
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
    };
  }
  ngOnInit() {
    this.route.params.subscribe((groupId: Params) => {
      this.groupDetails = groupId;
      if (this.groupDetails.groupId) {
        this.isEditScreen = true;
      }
    });
    this.getDevices();
    if (this.groupDetails.groupId) {
      this.getDeviceListInAGroup();
      this.getGroupDetails();
    }
  }

  getDevices() {
    let params;
    if (this.searchTerm === '') {
      params = new HttpParams()
        .set('pageIndex', this.selcetedPageNum)
        .set('pageSize', this.unassignedDevicesPaginationConfig.itemsPerPage)
        .set('sortDirection', this.sortDirection)
        .set('sortKeys', this.sortKeys);
    } else {
      params = new HttpParams()
        .set('pageIndex', this.selcetedPageNum)
        .set('pageSize', this.unassignedDevicesPaginationConfig.itemsPerPage)
        .set('sortDirection', this.sortDirection)
        .set('sortKeys', this.sortKeys)
        .set('search', this.searchInField)
        .set('searchTerm', this.searchTerm);
    }

    const unAssignedDevicessubscription = this.deviceService
      .getUnassignedDevices(params)
      .subscribe((data: DeviceListResponse) => {
        this.devicesList = data.content;
        this.unassignedDevicesPaginationConfig.totalItems = data.totalElements;
        this.unassignedDevicesPaginationConfig.currentPage = data.number + 1;
        this.noOfElements = data.numberOfElements;
        if (this.selectedDeviceListToTable.length) {
          for (const item of this.selectedDeviceListToTable) {
            for (const device of this.devicesList) {
              if (item.macid === device.macid) {
                device.disableRow = true;
                device.checked = true;
              }
            }
          }
        }
      });
    this.subscribers.push(unAssignedDevicessubscription);
  }
  getDeviceListInAGroup() {
    const deviceListInAGroupSubscription = this.deviceService
      .getDeviceListInAGroup(this.groupDetails.groupId)
      .subscribe((response: DeviceListResponse) => {
        this.deviceListInAGroup = response.content;
        this.selectedDeviceListToTable = response.content;
        this.selectedDevicesPaginationConfig.totalItems = this.selectedDeviceListToTable.length;
      });
    this.subscribers.push(deviceListInAGroupSubscription);
  }
  getGroupDetails() {
    this.deviceService.getGroupDetailsByGroupId(this.groupDetails.groupId).subscribe((response: any) => {
      this.selectedGroupName = response.name;
      this.groupName = response.name;
    });
  }

  toggleRow(event) {}

  toggleAllRow(event) {
    const status = event.target.checked;
    const previousPageIndex =
      this.selectedDevicesPaginationConfig.currentPage - 1;
    const startIndex = previousPageIndex ? previousPageIndex * 10 : 0;
    const endIndex = this.selectedDevicesPaginationConfig.currentPage * 10 - 1;

    this.selectedDeviceListToTable.forEach((element, index) => {
      if (index >= startIndex && index <= endIndex) {
        element.checked = status;
      }
    });
  }

  selectedDevicesToGroup(newData) {
    this.selectedDeviceList = this.selectedDeviceList.concat(newData);
    const totalGridData = this.selectedDeviceListToTable.concat(newData);
    const uniqueGridData = [];
    totalGridData.forEach((eachGridData, index) => {
      const eachData = JSON.parse(JSON.stringify(eachGridData));
      const gridIndex = uniqueGridData.findIndex(
        (d) => d.macid === eachData.macid
      );
      if (gridIndex === -1) {
        delete eachData.disableRow;
        delete eachData.checked;
        uniqueGridData.push(eachData);
      }
    });
    this.selectedDeviceListToTable = uniqueGridData;
    this.selectedDevicesPaginationConfig.totalItems = this.selectedDeviceListToTable.length;
  }
  deleteDeviceFromGroup(event) {
    const that = this;
    const selectedData = this.selectedDeviceListToTable.filter(
      (selectedDevice) => {
        return selectedDevice.checked;
      }
    );
    const selectedIds = selectedData.map((d) => d.macid);
    this.selectedDeviceListToTable = this.selectedDeviceListToTable.filter(
      (selectedDevice) => {
        return !selectedDevice.checked;
      }
    );

    this.rowSelectedToGroup = this.rowSelectedToGroup.filter((row) => {
      return selectedIds.indexOf(row.macid) === -1;
    });

    selectedData.forEach((eachSelectedData) => {
      const deviceIndex = that.devicesList.findIndex(
        (eachDevice) => eachDevice.macid === eachSelectedData.macid
      );
      const selectedDeviceIndex = that.selectedDeviceList.findIndex(
        (eachSelectedDevice) =>
          eachSelectedDevice.macid === eachSelectedData.macid
      );

      if (deviceIndex > -1) {
        that.devicesList[deviceIndex].checked = false;
        that.devicesList[deviceIndex].disableRow = false;
      }

      if (selectedDeviceIndex > -1) {
        that.selectedDeviceList.splice(selectedDeviceIndex, 1);
      }
    });

    that.selectedDevicesPaginationConfig.totalItems = this.selectedDeviceListToTable.length;
    that.selectedDevicesPaginationConfig.currentPage = 1;
  }

  selectedDevicesPageChange(newPage) {
    this.selectedDevicesPaginationConfig.currentPage = newPage;
    this.selectedDeviceListToTable.forEach((device) => {
      device.checked = false;
    });
  }
  pageChanged(pageNumber: number) {
    this.selcetedPageNum = pageNumber - 1;
    this.getDevices();
    this.unassignedDevicesPaginationConfig.currentPage = pageNumber;
  }

  updateGroup(action) {
    const groupDetails = {
      createdOn: 0,
      description: '',
      deviceCount: 0,
      name: this.groupName,
    };
    if (action === GroupActions.CreateGroup) {
      const createNewGroupsubscription = this.deviceService
        .createNewGroup(groupDetails)
        .subscribe((data: any) => {
          const groupId = data.id;
          const addDevicesToGroupsubscription = this.deviceService
            .addDevicesToGroup(groupId, this.selectedDeviceListToTable)
            .subscribe((response: any) => {
              this.toastrService.show(
                '<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp Group created successfully </span>',
                ' ',
                {
                  enableHtml: true,
                  titleClass: 'background',
                  positionClass: 'toast-top-center'
                }
              );
              this.router.navigate(['/groupDetails', groupId], {
                skipLocationChange: false,
              });
            });
          this.subscribers.push(addDevicesToGroupsubscription);
        });
      this.subscribers.push(createNewGroupsubscription);
    } else if (action === GroupActions.EditGroup) {
      if (this.selectedDeviceListToTable.length) {
        let values = {};
        if (this.selectedGroupName !== this.groupName) {
          values = {
            devices: this.selectedDeviceListToTable,
            groupName: this.groupName
          };
        } else {
          values = {
            devices: this.selectedDeviceListToTable
          };
        }
        const groupUpdatesubscription = this.deviceService
          .updateGroupData(this.groupDetails.groupId, values)
          .subscribe((response: any) => {
            this.toastrService.show(
              '<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp Group updated successfully </span>',
              ' ',
              {
                enableHtml: true,
                titleClass: 'background',
                positionClass: 'toast-top-center'
              }
            );
            this.router.navigate(['/groupDetails', this.groupDetails.groupId]);
          });
        this.subscribers.push(groupUpdatesubscription);
      } else if (this.selectedDeviceListToTable.length === 0) {
        if (this.selectedGroupName !== this.groupName) {
          const values = {
            devices: this.deviceListInAGroup,
            groupName: this.groupName
          };
          const groupUpdatesubscription = this.deviceService
            .updateGroupData(this.groupDetails.groupId, values)
            .subscribe((response: any) => {
              this.removeDevicesFromGroup();
            });
        } else {
          this.removeDevicesFromGroup();
        }
      }
    }
  }
  removeDevicesFromGroup() {
    const removeDevicesFromGroupsubscription = this.deviceService
      .removeDevicesFromGroup(this.groupDetails.groupId, this.deviceListInAGroup)
      .subscribe((response: any) => {
        this.toastrService.show(
          '<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp Group updated successfully </span>',
          ' ',
          {
            enableHtml: true,
            titleClass: 'background',
            positionClass: 'toast-top-center'
          }
        );
        this.router.navigate(['/groupDetails', this.groupDetails.groupId]);
      });
    this.subscribers.push(removeDevicesFromGroupsubscription);
  }
  searchDeviceList(searchString) {
    this.searchTerm = searchString;
    this.getDevices();
  }
  selectField(fieldName) {
    this.searchInField = fieldName;
  }

  cancelChanges() {
    this.deviceListInAGroup.forEach((device) => {
      device.checked = false;
    });
    this.selectedDeviceListToTable = this.deviceListInAGroup;
    this.devicesList.forEach((data) => {
      data.checked = false;
      data.disableRow = false;
    });
  }
  deleteGroup() {
    const deleteSubscription = this.deviceService
      .deleteGroup(this.groupDetails.groupId)
      .subscribe((data) => {
        this.toastrService.show(
          '<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp Group deleted successfully </span>',
          ' ',
          {
            enableHtml: true,
            titleClass: 'background',
            positionClass: 'toast-top-center',
          }
        );
        this.router.navigate(['/devices']);
      });
    this.subscribers.push(deleteSubscription);
  }

  showDeleteConfirmationModal() {
    this.deleteConfirmatopnModal.show();
  }
  checkForEmptyString(searchString) {
    if (searchString === '') {
      this.searchTerm = searchString;
      this.selcetedPageNum = 0;
      this.getDevices();
    }
  }
}
