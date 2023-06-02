import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../base-component.component';
import { DeviceService } from '../devices/device.service';
import { DeviceListResponse } from '../shared/models/device.model';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {
  metricsData: any;
  countCharging: any;
  countFaulted: any;
  countOffline: any;
  countBooting: any;
  countIdle: any;
  totalDeviceCount: any;
  getMetricsValues: any;
  totalMetricsCount: any;
  totalDevices: any;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private deviceService: DeviceService,
              public webSocketService: WebSocketService) {
    super();
  }

  ngOnInit(): void {
    this.getDevices();
    this.webSocketService.getSocketMessage();
  }

  viewPage(status) {
    this.router.navigate(['/devices', status], {
      skipLocationChange: false,
    });
  }

  getMetrics() {
    this.deviceService.getMetrics().subscribe(data => {
      this.metricsData = data;
      this.getMetricsValues = Object.values(this.metricsData);
      this.totalMetricsCount = this.getMetricsValues.reduce((a, b) => {
        return a + b;
      });
      this.totalDevices = this.totalDeviceCount;

      this.countCharging = (this.metricsData.Charging / this.totalDevices ) * 100;
      this.countOffline = (this.metricsData.Offline / this.totalDevices ) * 100;
      this.countFaulted = (this.metricsData.Faulted / this.totalDevices ) * 100;
      this.countBooting = (this.metricsData.Booting / this.totalDevices ) * 100;
      this.countIdle = (this.metricsData.Idle / this.totalDevices) * 100;
    });
  }

  getDevices() {
    const subscription = this.deviceService
      .getDevices()
      .subscribe((data: DeviceListResponse) => {
        this.totalDeviceCount = data.totalElements;
        this.getMetrics();
      });

    // adding the subscription to the {BaseComponent} to subscribe
    this.subscribers.push(subscription);
  }

}
