import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../base-component.component';
import { ActivatedRoute, Params } from '@angular/router';
import { DeviceService } from '../devices/device.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-logs-faults',
  templateUrl: './logs-faults.component.html',
  styleUrls: ['./logs-faults.component.scss']
})
export class LogsFaultsComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('showlogsbutton') showlogsbutton: ElementRef;
  @ViewChild('showfaultsbutton') showfaultsbutton: ElementRef;
  @ViewChild('downloadlogsbutton') downloadlogsbutton: ElementRef;
  @ViewChild('downloadfaultsbutton') downloadfaultsbutton: ElementRef;

  deviceLogs = [];
  deviceFaults = [];
  deviceSerial;
  deviceAlias;
  fromDate = '';
  toDate = '';
  fromDateLongFormat = '';
  toDateLongFormat = '';
  selectedPageNum: any = 0;
  faultSelectedPageNum: any = 0;
  configDataGrid: any;
  faultsConfigDataGrid: any;
  noOfElements: number;
  faultsNoOfElements: number;
  totalDeviceCount: number;
  faultsTotalDeviceCount: number;
  dateSelected = false;
  searchString = "";
  logsSelected: boolean = true;
  isAutoRefresh: boolean = false;
  refreshInterval;

  constructor(
    private route: ActivatedRoute,
    private deviceService: DeviceService
  ) {
    super();
    this.configDataGrid = {
      id: 'dataGridPagination',
      currentPage: 0,
      itemsPerPage: 10,
      totalItems: 0,
    };

    this.faultsConfigDataGrid = {
      id: 'faultsDataGridPagination',
      currentPage: 0,
      itemsPerPage: 10,
      totalItems: 0,
    };
  }

  ngOnInit(): void {
    this.deviceAlias = this.route.snapshot.queryParamMap.get('deviceAlias');
    if (!this.deviceAlias) {
      this.deviceAlias = '';
    }

    this.route.params.subscribe((id: Params) => {
      this.deviceSerial = id.id;
    });
    this.getLogs(this.deviceSerial, false);
    this.getFaults(this.deviceSerial, false);
  }

  pageChange(pageNumber: number) {
    this.selectedPageNum = pageNumber - 1;
    this.getLogs(this.deviceSerial, true);
    this.configDataGrid.currentPage = pageNumber;
  }

  faultsPageChange(pageNumber: number) {
    this.faultSelectedPageNum = pageNumber - 1;
    this.getFaults(this.deviceSerial, true);
    this.faultsConfigDataGrid.currentPage = pageNumber;
  }

  toggleAutorefresh() {
    this.clearAutoRefresh();
    if (this.isAutoRefresh == true) {
      this.refreshInterval = setInterval(this.refreshRecords.bind(this), 30000);
    } else {
      return;
    }
  }

  prepareForAPICall(needPagination, includeAllPages) {
    if (this.fromDate == '' && this.toDate == '') { // if both toDate and endDate are blank
      this.dateSelected = false;
      this.fromDateLongFormat = '';
      this.toDateLongFormat = '';
    } else {
      this.dateSelected = true;
      let maxDate: Date; // end date ... initialized to today.
      if(this.fromDate == ''){ // if user did not provide fromDate
        this.fromDateLongFormat = '0';
      } else {
        let minDate = new Date(this.fromDate);
        minDate.setHours(0, 0, 0, 0);
        this.fromDateLongFormat = String(minDate.getTime());
      }

      if(this.toDate != ''){ // if user provided toDate
        maxDate = new Date(this.toDate);
      } else {
        maxDate = new Date();
      }
      maxDate.setHours(24, 0, 0, 0); // fast foreward the date by 24 hours so that result for end day is also returned.
      this.toDateLongFormat = String(maxDate.getTime());
    }
    return this.getHTTPSParameter(needPagination, includeAllPages);
  }

  getHTTPSParameter(needPagination, includeAllPages) {
    let pageSize = '10';
    let pageIndex = '0';

    if (this.logsSelected) {
      if(includeAllPages){
        pageSize = this.configDataGrid.totalItems + '';
      } else {
        pageSize = this.configDataGrid.itemsPerPage + '';
      }
      pageIndex = this.selectedPageNum + '';
    }
    else {
      if(includeAllPages){
        pageSize = this.faultsConfigDataGrid.totalItems + '';
      } else {
        pageSize = this.faultsConfigDataGrid.itemsPerPage + '';
      }
      pageIndex = this.faultSelectedPageNum + '';
    }

    let params = new HttpParams().set('search', this.searchString).set('pageSize', pageSize);
    if (needPagination) {
      params = params.append('pageIndex', pageIndex);
    }

    if (this.dateSelected) {
      params = params.append('from', this.fromDateLongFormat);
      params = params.append('to', this.toDateLongFormat);
    }
    return params;
  }

  changeFromDate(dateString){
    this.fromDate = dateString;
    if(dateString == ''){
      this.refreshRecords();
    }
  }

  changeToDate(dateString){
    this.toDate = dateString;
    if(dateString == ''){
      this.refreshRecords();
    }
  }
  
  getLogs(deviceSerial, needPagination) {
    const params = this.prepareForAPICall(needPagination, false);
    const deviceLogsSubscription = this.deviceService.getDeviceLogsData(deviceSerial, params).subscribe((data) => {
      this.deviceLogs = data.content;
      this.configDataGrid.totalItems = data.totalElements;
      this.totalDeviceCount = data.totalElements;
      this.configDataGrid.currentPage = data.number + 1;
      this.noOfElements = data.numberOfElements;
    });
    this.subscribers.push(deviceLogsSubscription);
  }

  getFaults(deviceSerial, needPagination) {
    const params = this.prepareForAPICall(needPagination, false);
    const deviceFaultsSubscription = this.deviceService.getDeviceFaultsData(deviceSerial, params).subscribe((data) => {
      this.deviceFaults = data.content;
      this.faultsConfigDataGrid.totalItems = data.totalElements;
      this.faultsTotalDeviceCount = data.totalElements;
      this.faultsConfigDataGrid.currentPage = data.number + 1;
      this.faultsNoOfElements = data.numberOfElements;
    });
    this.subscribers.push(deviceFaultsSubscription);
  }

  showLogs() {
    this.showlogsbutton.nativeElement.blur();
    this.getLogs(this.deviceSerial, false);
  }

  showFaults() {
    this.showfaultsbutton.nativeElement.blur();
    this.getFaults(this.deviceSerial, false);
  }

  downloadLogs() {
    this.downloadlogsbutton.nativeElement.blur();
    const params = this.prepareForAPICall(false, true);
    const downloadDeviceFaultsSubscription = this.deviceService.downloadDeviceLogs(this.deviceSerial, params).subscribe((data) => {
      this.downloadFile(data);
    }, err => {
    });
    this.subscribers.push(downloadDeviceFaultsSubscription);
  }
  
  downloadFaults() {
    this.downloadfaultsbutton.nativeElement.blur();
    const params = this.prepareForAPICall(false, true);
    const downloadDeviceFaultsSubscription = this.deviceService.downloadDeviceFaults(this.deviceSerial, params).subscribe((data) => {
      this.downloadFile(data);
    }, err => {
    });
    this.subscribers.push(downloadDeviceFaultsSubscription);
  }

  getFileName() {
    let fileName = '';
    if (this.deviceAlias && this.deviceAlias != '') {
      fileName = fileName + this.deviceAlias;
    } else {
      fileName = fileName + this.deviceSerial;
    }
    if (this.dateSelected) {
      const toDateSubstring = this.toDate == '' ? new Date().toISOString().slice(0, 10) : this.toDate;
      const fromDateSubstring = this.fromDate == '' ? 'OLDEST' : this.fromDate;
      fileName = fileName + '_' + (fromDateSubstring) + '_to_' + (toDateSubstring);
    }
    if (this.logsSelected) {
      fileName = fileName + '_logs.csv';
    }
    else {
      fileName = fileName + '_faults.csv';
    }
    return fileName;
  }

  downloadFile(data: any) {
    const a = document.createElement('a');
    var blob = new Blob([data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = this.getFileName();
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }


  logsTabClick() {
    if(this.logsSelected == true){ // logs tab already selected. nothing to do
      return;
    }
    this.logsSelected = true;
    // restore logs snapshot
    this.searchString = '';
    this.toDate = '';
    this.fromDate = '';

    this.refreshRecords();
  }

  faultsTabClick() {
    if(this.logsSelected == false){ // faults tab already selected. nothing to do
      return;
    }
    this.logsSelected = false;
    // restore faults snapshot
    this.searchString = '';
    this.toDate = '';
    this.fromDate = '';

    this.refreshRecords();
  }

  refreshRecords() {
    if (this.logsSelected) {
      this.getLogs(this.deviceSerial, false);
    }
    else {
      this.getFaults(this.deviceSerial, false);
    }
  }

  clearAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  }

  
  checkForEmptyString(searchString) {
    if (searchString === '') {
      this.searchString = searchString;
      this.selectedPageNum = 0;
      this.refreshRecords();
    }
  }

  ngOnDestroy() {
    this.clearAutoRefresh();
  }
}
