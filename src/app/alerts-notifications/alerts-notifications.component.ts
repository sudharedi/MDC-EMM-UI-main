import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertsService } from '../shared/models/services/alerts.service';
import { BaseComponent } from '../base-component.component';
import { DeviceService } from '../devices/device.service';

@Component({
  selector: 'app-alerts-notifications',
  templateUrl: './alerts-notifications.component.html',
  styleUrls: ['./alerts-notifications.component.scss']
})
export class AlertsNotificationsComponent extends BaseComponent implements OnInit {
  @ViewChild('tabs') tabs;

  alertsData = [];
  constructor(
    private deviceService: DeviceService,
    private alertsService: AlertsService
  ) {
    super();
   }

  ngOnInit(): void {
    this.getAlerts();

  }


  getAlerts() {
    const subscription = this.alertsService.fectAll().subscribe(data => {
      this.alertsData = data;
      this.alertsData.forEach(history => {
        let timeConvert = history.timestamp;
        history.timestamp = new Date(parseInt(history.timestamp)).toLocaleDateString('en-GB');
        history.timestamp = history.timestamp.replace(/[/]/g, "-");
        history.timestamp = this.deviceService.swap_date_with_month_conversion(history.timestamp, '-');
        history.time = new Date(parseInt(timeConvert)).toLocaleTimeString('en-GB');
      });
      this.alertsData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    });

  }

}
