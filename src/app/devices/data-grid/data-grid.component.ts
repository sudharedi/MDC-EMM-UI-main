import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  DoCheck
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Device } from '../../shared/models/device.model';
import { DeviceService } from '../device.service';
import { BaseService } from 'src/app/base-service.service';
import { WebSocketService } from 'src/app/web-socket.service';

import { ColDef } from 'ag-grid-community';
import { DeviceEnrollmentFilter } from './device-enrollment-filter.component';
import { CustomHeaderCheckbox } from './custom-header.component';
import { CheckboxCellRenderer } from './custom-checkbox-cell.component';
import { BaseComponent } from '../../base-component.component';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
  providers: [DatePipe]
})
export class DataGridComponent extends BaseComponent implements OnInit, OnChanges, DoCheck {
  @Input() devicesList: Device[];
  @Input() config: any;
  @Input() enableColumnReorder: boolean;
  @Input() tableColumnHeaders: any;
  @Input() noOfElements: number;
  @Input() showSelectButton: boolean;
  @Input() showRemoveButton: boolean;
  @Input() showPagination: boolean;
  @Output() selectedDevices: EventEmitter<any> = new EventEmitter();
  @Output() pageChanged: EventEmitter<any> = new EventEmitter();
  @Output() selectedDevicesToGroup: EventEmitter<any> = new EventEmitter();
  @Output() deleteDeviceFromGroup: EventEmitter<any> = new EventEmitter();
  @Output() toggleRow: EventEmitter<any> = new EventEmitter();
  @Output() toggleAllRow: EventEmitter<any> = new EventEmitter();
  @Input() rowSelectedToGroup: any;
  @Input() clearRowSelected: boolean;
  @Output() changeBooleanValue: EventEmitter<any> = new EventEmitter();
  @Output() selectedDates: EventEmitter<any> = new EventEmitter();

  moduleId: 'devicegrid'//defined to get the preferences for the grid
  filter;
  key = 'name'; // set default
  reverse = true;
  rowSelected = [];
  showdropdown = false;
  emitRowSelectedToGroups = [];
  selectAllDevice = false;
  fromDate = '';
  toDate = '';
  sortDirection = 'ASC';
  minHeight;
  minDate;
  disableToDate = false;

  deviceSelectionParmeter = {
    allSelected: false,
  };
  private gridApi;

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }


  frameworkComponents = {
    deviceEnrollmentFilter: DeviceEnrollmentFilter,
    headerCheckbox: CustomHeaderCheckbox,
    checkboxCell: CheckboxCellRenderer
  };

  onDragStopped(param) {
    const gridPreferencesArray = this.getGridPreferencesArray(param.columnApi.columnModel.displayedColumns);
    const saveGridSubscription = this.deviceService
      .saveGridPreferences('userpreference', gridPreferencesArray)
      .subscribe((response: any) => {
        this.setSavedGridPreferences('userpreference');
      }, (response: any) => {
        this.setSavedGridPreferences('userpreference');
      });
    
    this.subscribers.push(saveGridSubscription);
  }

  setSavedGridPreferences(id) {
    const subscription = this.deviceService
      .getGridPreferences(id)
      .subscribe((data => {
        this.setNewGridConfiguration(data);
      }),
      (error => {
        // no preferences stored as of yet. initialise user preference with default values.
        const saveGridSubscription = this.deviceService
          .saveGridPreferences('userpreference', this.defaultColumnDefinitionArray)
          .subscribe((response: any) => {
            this.setSavedGridPreferences('userpreference');
          }, (response: any) => {
            this.setSavedGridPreferences('userpreference');
          });
        
        this.subscribers.push(saveGridSubscription);
      }));
    this.subscribers.push(subscription);
  }

  getGridPreferencesArray(diplayedColumnDefinitionObjectParam) {
    const colDefinitionNamesArray = [];
    diplayedColumnDefinitionObjectParam.forEach(element => {
      colDefinitionNamesArray.push(element.colId);
    });
    return colDefinitionNamesArray;
  }

  setNewGridConfiguration(columnConfigurationArray) {
    this.columnDefs.length = 0;
    columnConfigurationArray.forEach(element => {
      const columnDefinitionItem = this.columnDefinitionMap[element];
      if (columnDefinitionItem != undefined) {
        this.columnDefs.push(columnDefinitionItem);
      } else {
        console.error('Error. No column definition found for key:', element);
      }
    });
    if(this.gridApi){
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }

  columnDefinitionMap = {
    row_select: {
      // field: '',
      colId: 'row_select',
      headerComponent: 'headerCheckbox',
      headerComponentParams: {
        selectAll: this.selectAll.bind(this),
        selectAllDevice: this.deviceSelectionParmeter,
      },
      cellRenderer: 'checkboxCell',
      cellRendererParams: {
        selectedRow: this.selectedRow.bind(this),
      },
      lockPosition: true,
      width: 60
    },
    macid: {
      field: 'macid',
      headerName: 'Mac ID',
      cellRenderer: this.macIdCellRenderer.bind(this),
      tooltipField: 'macid'
    },
    alias: {
      field: 'alias',
      headerName: 'Alias',
      tooltipField: 'alias'
    },
    customer: {
      field: 'customer',
      headerName: 'Customer',
      tooltipField: 'customer'
    },
    group: {
      field: 'group',
      headerName: 'Group',
      tooltipField: 'group'
    },
    enrolled_on: {
      field: 'enrolled_on',
      headerName: 'Date Enrolled',
      filter: 'deviceEnrollmentFilter',
      icons: {
        sortAscending: '<i class="fa fa-sort-alpha-up"/>',
        sortDescending: '<i class="fa fa-sort-alpha-down"/>',
      },

      tooltipValueGetter: (data) => {
        if (data.value == 0) {
          return 'NA'
        } else {
          return this.datePipe.transform(new Date(data.value), 'MM-dd-yyyy HH:mm:ss');
        }
      },
      cellRenderer: (data) => {
        if (data.value == 0) {
          return 'NA'
        } else {
          return this.datePipe.transform(new Date(data.value), 'MM-dd-yyyy HH:mm:ss');
        }

      },

      filterParams: {
        test: 'test value',
        selectedDateRange: this.selectedDateRangeNew.bind(this),
        clearSelectedDates: this.clearSelectedDates.bind(this),
        from: this.fromDate,
        to: this.toDate,
        sortDirection: this.sortDirection,
        disableToDate: this.disableToDate
      },
    },
    location: {
      // field: 'location', // TODO: location + locationZip
      colId: 'location',
      headerName: 'Location',
      valueGetter: this.locationValueGetter,
      tooltipValueGetter: this.locationValueGetter,
    },
    serial: {
      colId: 'serial',
      field: 'assembly_serial',
      headerName: 'MDJB Serial #',
      tooltipField: 'assembly_serial'
    },
    lastSeen: {
      colId: 'lastSeen',
      headerName: 'Last Seen',
      valueGetter: this.lastSeenValueGetter,
      tooltipValueGetter: this.lastSeenValueGetter,
    },
    status: {
      colId: 'status',
      headerName: 'Status',
      tooltipValueGetter: this.statusValueGetter,
      valueGetter: this.statusValueGetter,
    },
    uptime_converted: {
      field: 'uptime_converted',
      headerName: 'Uptime HH:MM:SS',
      tooltipField: 'uptime_converted'
    },
    warning_column: {
      colId: 'warning_column',
      headerName: 'Warning',
      valueGetter: this.warningValueGetter,
      cellStyle: this.warningCellStyleProvider,
      tooltipValueGetter: this.warningValueGetter,
    }
  };
  defaultColumnDefinitionArray = ['row_select', 'macid', 'customer', 'alias', 'group', 'enrolled_on', 'location', 'serial', 'lastSeen', 'status', 'uptime_converted', 'warning_column'];
  columnDefs: ColDef[] = [];

  columnTypes = {
    defaultColumnType: {
    },
  }

  defaultColDef = {
    // wrapText: true,
    // autoHeight: true,
    editable: false,
    borders: true,
  };

  
  statusValueGetter(params) {
    return params.data?.presence === 'JobNotification' ? 'NA' : (params.data?.presence ? String(params.data?.presence).toUpperCase() : '');
  }

  lastSeenValueGetter(params) {
    return params.data?.lastSeen === 'Invalid Date' ? 'NA' : params.data?.lastSeen;
  }

  warningCellStyleProvider(params) {
    const diffDays = parseInt(params.data.diffDays);
    if (diffDays < 3) {
      return { color: '#FA415F' };
    } else {
      return { color: '#109AD6' };
    }

  }

  warningValueGetter(params) {
    return (params.data.diffDays < 3 && params.data.diffDays > 0 ? 'Certificate will expire in ' : (params.data.diffDays < 0 ? 'Certificate expired' : 'NA'))
      + ' ' + (params.data.diffDays < 3 && params.data.diffDays > 0 ? params.data.diffDays : ' ')
      + ' ' + (params.data.diffDays < 3 && params.data.diffDays > 0 ? 'day(s)' : ' ');
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.setSavedGridPreferences('userpreference');
  }

  rowSelectCellRenderer(params) {
    const checkboxElement = document.createElement("INPUT") as HTMLInputElement;
    checkboxElement.setAttribute("type", "checkbox");
    checkboxElement.checked = params?.data?.checked;
    checkboxElement.onchange = function (event) {
      if (params?.data?.checked) {
        params.data.checked = event.target.checked
      }
    }.bind(this);
    checkboxElement.onclick = function (event) {
      this.selectedRow(event.target.checked, params?.data);
    }.bind(this);
    return checkboxElement;
  }

  macIdCellRenderer(params) {
    const serialId = params?.data?.serial;
    const newA = document.createElement("a");
    newA.href = "javascript:void(0)";
    newA.innerHTML = params.value;
    newA.onclick = function () {
      this.router.navigate(['/deviceDetails', serialId], { skipLocationChange: false });
    }.bind(this);
    return newA;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private baseService: BaseService,
    public webSocketService: WebSocketService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
  }

  viewDeviceDetails(selectedDevice) {
    this.router.navigate(['/deviceDetails', selectedDevice.serial], {
      skipLocationChange: false,
    });
  }

  selectedRow(checked, seclectedDevice) {
    if (this.toggleRow.observers && this.toggleRow.observers.length) {
      this.toggleRow.emit({ checked, seclectedDevice });
      let checkedDeviceCount = 0;
      this.devicesList.forEach((element) => {
        if (true == element.checked) {
          ++checkedDeviceCount;
        }
      });
      if(checked == true){
        if(checkedDeviceCount == (this.devicesList.length - 1)){
          this.selectAllDevice = true;
        }
      } else {
        this.selectAllDevice = false;
      }
    } else {
      if (checked) {
        seclectedDevice.checked = true;
        this.rowSelected.push(seclectedDevice);
        if (this.rowSelectedToGroup) {
          this.rowSelectedToGroup.push(seclectedDevice);
        }
      } else {
        seclectedDevice.checked = false;
        this.rowSelected.forEach((value, key) => {
          if (seclectedDevice === value) {
            this.rowSelected.splice(key, 1);
          }
        });
        if (this.rowSelectedToGroup) {
          this.rowSelectedToGroup.forEach((value, key) => {
            if (seclectedDevice.macid === value.macid) {
              this.rowSelectedToGroup.splice(key, 1);
            }
          });
        }
      }
      this.checkDuplicates(this.rowSelected);
    }
  }

  deviceClick(selectedDevice) {
    this.router.navigate(['/deviceDetails', selectedDevice.serial], { skipLocationChange: false });
  }

  selectAll(event) {
    if (this.toggleAllRow.observers && this.toggleAllRow.observers.length) {
      this.toggleAllRow.emit(event);
    } else {
      if (event.target?.checked) {
        this.devicesList.forEach((device, key) => {
          device.checked = true;
          this.rowSelected.push(device);
          if (this.rowSelectedToGroup) {
            this.rowSelectedToGroup.push(device);
          }
        });
      } else {
        this.devicesList.forEach((device, key) => {
          device.checked = false;
          this.rowSelected = [];
          this.rowSelectedToGroup = [];
        });
      }
      this.checkDuplicates(this.rowSelected);
    }
  }

  checkDuplicates(SelectedGroupsList) {
    this.rowSelected = [...new Set(SelectedGroupsList)];
    this.selectedDevices.emit(this.rowSelected);

    if (this.rowSelected.length === 0 || this.rowSelected.length < 10) {
      this.selectAllDevice = false;
      this.deviceSelectionParmeter.allSelected = false;
    }

    if (this.rowSelected.length === this.devicesList.length) {
      this.selectAllDevice = true;
      this.deviceSelectionParmeter.allSelected = true;
    } else {
      this.selectAllDevice = false;
      this.deviceSelectionParmeter.allSelected = false;
    }
    if(this.gridApi){
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }

  pageChange(pageNumber: number) {
    this.pageChanged.emit(pageNumber);
    this.rowSelected = [];
    this.rowSelectedToGroup = [];
    this.selectAllDevice = false;
    this.selectedDevices.emit(this.rowSelected);
    this.deviceSelectionParmeter.allSelected = false;
    if(this.gridApi){
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }

  locationValueGetter(params) {
    return (params.data?.location ? params.data.location : 'NA') + ' ' + (params.data?.locationZip ? params.data.locationZip : ' ');
  }

  filterDate() {
    this.showdropdown = !this.showdropdown;
    if (this.devicesList.length >= 1 && this.showdropdown === true) {
      this.minHeight = '400px';
    }
  }
  selectIndividualRowsToGroup() {
    this.rowSelectedToGroup.forEach((item) => {
      item.disableRow = true;
    });
    this.selectedDevicesToGroup.emit(this.rowSelectedToGroup);
    this.selectAllDevice = false;
    this.deviceSelectionParmeter.allSelected = false;
    if(this.gridApi){
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }
  deleteRow() {
    this.deleteDeviceFromGroup.emit('deleteRows');
    this.selectAllDevice = false;
    this.deviceSelectionParmeter.allSelected = false;
    if(this.gridApi){
      this.gridApi.setColumnDefs(this.columnDefs);
    }
  }

  ngOnChanges() {
    if (this.clearRowSelected) {
      this.rowSelected = [];
      this.selectAllDevice = false;
      this.deviceSelectionParmeter.allSelected = false;
      if(this.gridApi){
        this.gridApi.setColumnDefs(this.columnDefs);
      }
    }
    const parentThis = this;
    setTimeout(function(){ parentThis.changeBooleanValue.emit(); }, 10); // making async call to avaoid race condition.
    this.fromDate = '';
    this.toDate = '';
    this.sortDirection = 'ASC';
    if (this.devicesList && this.devicesList.length > 4) {
      this.minHeight = '400px';
    }
  }


  selectedDateRangeNew(fromDateParam, toDateParam, sortDirectionParam) {
    const selectedDatesObj = {
      from: new Date(fromDateParam).getTime(),
      to: new Date(toDateParam).getTime(),
      sortDirection: sortDirectionParam
    };
    this.selectedDates.emit(selectedDatesObj);
    this.showdropdown = !this.showdropdown;
    if(this.gridApi){
      this.gridApi.hidePopupMenu();
    }
  }

  selectedDateRange() {
    const selectedDatesObj = {
      from: new Date(this.fromDate).getTime(),
      to: new Date(this.toDate).getTime(),
      sortDirection: this.sortDirection
    };
    this.selectedDates.emit(selectedDatesObj);
    this.showdropdown = !this.showdropdown;
  }

  applyFilterOnAuditLogs() {
    const selectedDatesObj = {
      from: new Date(this.fromDate).getTime(),
      to: new Date(this.toDate).getTime(),
      sortDirection: this.sortDirection
    };
    this.selectedDates.emit(selectedDatesObj);
    this.showdropdown = !this.showdropdown;
  }

  clearSelectedDates() {
    this.fromDate = '';
    this.toDate = '';
    this.sortDirection = 'ASC';
    this.disableToDate = false;
    this.showdropdown = !this.showdropdown;
    if(this.gridApi){
      this.gridApi.hidePopupMenu();
    }
  }

  ngDoCheck() {
    const socketJobStatusObject = JSON.parse(sessionStorage.getItem('socketObject'));
    if (socketJobStatusObject) {
      socketJobStatusObject.forEach(device => {
        this.devicesList.forEach((deviceList, key) => {
          if (device.type === 'uptime' && device.deviceSerial === deviceList.serial) {
            this.devicesList[key].uptime_converted = this.deviceService.uptime_conversion(device.message);
          }
          if (device.type === 'lastseen' && device.deviceSerial === deviceList.serial) {
            this.devicesList[key].lastSeen = new Date(parseInt(device.message)).toLocaleString('en-GB');
            this.devicesList[key].lastSeen = this.devicesList[key].lastSeen.replace(/[/]/g, "-");
            this.devicesList[key].lastSeen = this.devicesList[key].lastSeen.replace(/,/g, "");
            this.devicesList[key].lastSeen = this.deviceService.swap_date_with_month_conversion(this.devicesList[key].lastSeen, '-');
          }

          if (device.deviceSerial === deviceList.serial && device.type !== 'uptime' && device.type !== 'lastseen') {
            this.devicesList[key].presence = device.type;
          }
        });
      });
    }
  }

  dateValidations() {
    this.minDate = new Date(this.fromDate).toISOString().split('T')[0];
    if (this.toDate) {
      if (this.fromDate > this.toDate) {
        this.disableToDate = true;
      } else {
        this.disableToDate = false;
      }
    }
  }

}
