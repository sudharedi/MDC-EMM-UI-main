import { Component, OnInit } from '@angular/core';
import { AuditLogsService } from '../shared/models/services/auditLogs.service';
import { BaseComponent } from '../base-component.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss']
})
export class AuditLogsComponent extends BaseComponent implements OnInit {

  auditLogsData = [];
  configAuditLog: any;
  itemsPerPage: any = 10;
  noOfElements: number;
  searchTerm: any = '';
  searchInField = 'action';
  tableColumnHeaders = {
    checkboxSelection: false,
    macid: false,
    alias: true,
    customer: false,
    group: true,
    enrolled_on: false,
    location: false,
    status: false,
    uptime: false,
    warning: false,
    action: false,
    serial: false,
    simiccid: false,
    cradlepoint_id: false,
    last_heard: false,
    action_performed: true,
    date: true,
    time: true,
    perfomed_by: true,
    device_serial: true,
    oldValue: true,
    newValue: true
  };
  selectedPageNum: any = 0;
  sortDirection = 'DESC';
  userRoles;

  constructor(private auditLogsService: AuditLogsService) {
    super();
    this.configAuditLog = {
      id: 'dataGridPagination',
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      to: '',
      from: ''
    };
  }
  ngOnInit(): void {
    this.getAuditLogsList();
    this.userRoles = JSON.parse(localStorage.getItem('userRoles'));
  }
  getAuditLogsList() {
    let params;
    if(this.searchTerm === '') {
      if(this.configAuditLog.to == '' || this.configAuditLog.from == ''){
        params = new HttpParams()
        .set('pageIndex', this.selectedPageNum)
        .set('pageSize', this.configAuditLog.itemsPerPage)
        .set('sortDirection', this.sortDirection);
      } else {
        params = new HttpParams()
        .set('pageIndex', this.selectedPageNum)
        .set('pageSize', this.configAuditLog.itemsPerPage)
        .set('to', this.configAuditLog.to)
        .set('from', this.configAuditLog.from)
        .set('search', 'timestamp')
        .set('sortDirection', this.sortDirection);
      }
    } else {
      params = new HttpParams()
      .set('pageIndex', this.selectedPageNum)
      .set('pageSize', this.configAuditLog.itemsPerPage)
      .set('sortDirection', this.sortDirection)
      .set('search', this.searchInField)
      .set('searchTerm', this.searchTerm);
    }
    
    const subscription = this.auditLogsService.fectAll(params).subscribe(data => {
      this.auditLogsData = data.content;
      this.noOfElements = data.numberOfElements;
      this.configAuditLog.totalItems = data.totalElements;
    });
    // adding the subscription to the {BaseComponent} to subscribe
    this.subscribers.push(subscription);
  }

  pageChanged(pageNumber: number) {
    this.selectedPageNum = pageNumber - 1;
    this.getAuditLogsList();
    this.configAuditLog.currentPage = pageNumber;
  }
  selectField(fieldName) {
    this.searchInField = fieldName;
  }

  applyDateFilter(paramObject){
    this.searchTerm = '';
    this.selectedPageNum = 0;
    const params = new HttpParams()
    .set('pageIndex', this.selectedPageNum)
    .set('pageSize', this.configAuditLog.itemsPerPage)
    .set('sortDirection', paramObject.sortDirection)
    .set('to', paramObject.to)
    .set('from', paramObject.from)
    .set('search', 'timestamp');
    
    this.configAuditLog.to = paramObject.to;
    this.configAuditLog.from = paramObject.from;

    const subscription = this.auditLogsService.fectAll(params).subscribe(data => {
      this.auditLogsData = data.content;
      this.noOfElements = data.numberOfElements;
      this.configAuditLog.totalItems = data.totalElements;
    });
    // adding the subscription to the {BaseComponent} to subscribe
    this.subscribers.push(subscription);
  }

  searchAuditLogList(searchString) {
    this.searchTerm = searchString;
    this.selectedPageNum = 0;
    
    this.configAuditLog.to = '';
    this.configAuditLog.from = '';
    this.getAuditLogsList();
  }
  checkForEmptyString(searchString) {
    if (searchString === '') {
      this.searchTerm = searchString;
      this.selectedPageNum = 0;
      this.getAuditLogsList();
    }
  }
}
