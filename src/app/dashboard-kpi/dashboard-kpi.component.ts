import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../devices/device.service';
import { Device } from '../shared/models/device.model';
import { BaseComponent } from '../base-component.component';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-dashboard-kpi',
  templateUrl: './dashboard-kpi.component.html',
  styleUrls: ['./dashboard-kpi.component.scss']
})
export class DashboardKpiComponent extends BaseComponent implements OnInit {
  devicesList: Device[];
  configDataGrid: any;
  tableColumnHeaders = {
    checkboxSelection: false,
    macid: true,
    alias: true,
    customer: false,
    group: true,
    enrolled_on: true,
    location: true,
    status: true,
    uptime: true,
    warning: true,
    action: true,
    serial: false,
    simiccid: false,
    cradlepoint_id: false,
    last_heard: false,
  };
  selectedStatus;
  diffDays: number;

  constructor(private deviceService: DeviceService, private route: ActivatedRoute) {
    super();
    this.configDataGrid = {
      id: 'dataGridPagination',
      currentPage: 0,
      itemsPerPage: this.devicesList?.length,
      totalItems: 0,
    };

  }

  ngOnInit(): void {
    this.route.params.subscribe((status: Params) => {
      this.selectedStatus = status;
    });
    this.getDevicesByStatus();

  }

  getDevicesByStatus() {
    const subscription = this.deviceService
      .getDevicesBystatus(this.selectedStatus.status)
      .subscribe((data) => {
        this.devicesList = data;

        this.devicesList.forEach(device => {
          const date1 = new Date().getTime();
          const date2 = new Date(device.certificate?.expiresOn).getTime();
          device.diffDays = Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24));
          device.uptime_converted = this.deviceService.uptime_conversion(device.uptime);
        });
      });
    this.subscribers.push(subscription);
  }

}
