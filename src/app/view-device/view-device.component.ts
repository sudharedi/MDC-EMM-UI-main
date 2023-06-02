import { Component, DoCheck, HostListener, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DeviceService } from '../devices/device.service';
import { FormGroup, FormControl } from '@angular/forms';
import { BaseComponent } from '../base-component.component';
import { ConfigurationService } from '../configuration/configuration.service';
import { ConfigurationsResponse, Configurations } from '../shared/models/configuration.model';
import { FirmwareService } from '../firmware/firmware.service';
import { UpdateType } from '../../app/shared/models/update.type';
import { AppPackageService } from '../../app/shared/models/services/appPackages.service';
import { ToastrService } from 'ngx-toastr';
// import * as io from "socket.io-client";
import { HttpParams } from '@angular/common/http';
import { WebSocketService } from '../web-socket.service';
import { TitleCasePipe } from '@angular/common';
import { min } from 'rxjs/operators';
import { config } from 'process';

@Component({
  selector: 'app-view-device',
  templateUrl: './view-device.component.html',
  styleUrls: ['./view-device.component.scss']
})
export class ViewDeviceComponent extends BaseComponent implements OnInit, DoCheck {
  @ViewChild('editModal', { static: false }) editModal: ModalDirective;
  @ViewChild('updateHistoryModal') updateHistoryModal: ModalDirective;
  @ViewChild('configurationUpdateHistoryModal') configurationUpdateHistoryModal: ModalDirective;
  @ViewChild('deviceHistoryModal') deviceHistoryModal: ModalDirective;
  @ViewChild('configuarationUpdateModal') configuarationUpdateModal: ModalDirective;
  @ViewChild('updateDeviceAppModal') updateDeviceAppModal: ModalDirective;
  @ViewChild('unInstallConfirmatopnModal', { static: false }) unInstallConfirmatopnModal: ModalDirective;
  @ViewChild('releaseNotesModal', { static: false }) releaseNotesModal: ModalDirective;
  @ViewChild('cancelAppInstallationModal', { static: false }) cancelAppInstallationModal: ModalDirective;

  selectedDeviceId;
  deviceData: any;
  
  editDeviceForm = new FormGroup({
    alias: new FormControl(),
    group: new FormControl(),
    location: new FormControl(),
    locationZip: new FormControl(),
  });

  showMore = false;

  allDeviceData: any;
  updateHistoryData;
  configHistoryData;
  deviceHistoryData;
  deviceRecentFaultsData;
  selectedTabName = 'defaultpackages';
  deviceGroupsNames = [];
  configValues: Configurations[];
  configValuesLastUpdated: any;
  configValuesCopy: Configurations[];
  updateType = UpdateType.Single_Device;
  selectedApp;
  allPackageData;
  selectedAppId;
  selectedDeviceAppsList;
  finalAppPackagesList;
  restartDevice = false;
  modalHeaderText = '';
  modalContent: any;
  releaseNotesContent;
  releaseNotesHeading;
  appPackageJobId;
  markdownReleaseNotes: any;
  configHistory: any;
  deviceHistoryPaginationConfig: any;
  recentFaultsPaginationConfig: any;
  configSoftware: any;
  selectedPageNum: any = 0;
  selectedPageNumSoftware: any = 0;
  sortDirection = 'ASC';
  sortDirectionDescending = 'DESC';
  sortKeys = 'timestamp';
  itemsPerPage: any = 10;
  noOfElements: number;
  noOfElementsSoftware: number;
  totalDeviceCount: number;
  totalDeviceCountSoftware: number;
  appPackageVersion;
  private loading = false;
  userRoles;
  emm = '';

  faultHistory = '';
  logHistory = '';
  iniTimeStart: any;
  iniTimeEnd: any;
  timeZoneInte: any;
  receiveSelectedDay:string;
  receiveTimeValue:any;
  receiveTimeEndValue:any;
  receiveAMPMValue:any;
  receiveAMPMEndValue:any;
  receiveHourFormatValue:any;
  receiveHourFormatEndValue:any;
  receiveUTCFormatValue:any;
  historyUTCHourOldValueTimeFormat:any;
  historyUTCHourNewValueTimeFormat:any;
  historyHourNewValueTimeFormat:any;
  historyHourOldValueTimeFormat:any;
  historyDaysNewValueFormat:any;
  historyDaysOldValueFormat:any;
  defaultStartTimeValue:any;
  defaultEndTimeValue:any;

  // tslint:disable-next-line:max-line-length
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deviceService: DeviceService,
    private configurationService: ConfigurationService,
    private firmwareService: FirmwareService,
    private appPackageService: AppPackageService,
    private toastrService: ToastrService,
    public webSocketService: WebSocketService,
    private titlecasePipe: TitleCasePipe
  ) {
    super();

    this.configHistory = {
      id: 'dataGridPagination',
      currentPage: 0,
      itemsPerPage: 10,
      totalItems: 0,
    };

    this.recentFaultsPaginationConfig = {
      id: 'recentFaultsPagination',
      currentPage: 0,
      itemsPerPage: 5,
      totalItems: 0,
    };

    this.deviceHistoryPaginationConfig = {
      id: 'deviceHistoryPagination',
      currentPage: 0,
      itemsPerPage: 10,
      totalItems: 0,
    };

    this.configSoftware = {
      id: 'softwareGridPagination',
      currentPage: 0,
      itemsPerPage: 10,
      totalItems: 0,
    };
  }
  ngOnInit(): void {
    const routeSubscription = this.route.params.subscribe((macid: Params) => {
      // macid refers to serial . API got changed. previously we were sending macid. Now we need to send serial
      this.selectedDeviceId = macid;
    });
    this.subscribers.push(routeSubscription);
    this.getDeviceDetailsData();

    const groupSubscription = this.deviceService.getGroupNames().subscribe(data => {
      data.forEach(groupName => {
        this.deviceGroupsNames.push(groupName.name);
      });
    });
    this.subscribers.push(groupSubscription);

    this.getDeviceFaultsData();

    const configurationSubscription = this.configurationService
      .getConfigValues(this.selectedDeviceId.macid).subscribe((data: ConfigurationsResponse) => {
        console.log("Device ID",this.selectedDeviceId.macid);

        this.configValues = data.configs;
        this.configValues.forEach((config) => {
          if(config.name == "device_reboot_schedule_start") {
            this.defaultStartTimeValue = config.intValue;
            let initialValue = config.intValue;
            let newHourside = Math.floor(initialValue/ 60);
            let newMinuteSide = initialValue % 60;
            let newStringHour = ""+newHourside;
            let newStringMinute = "";
            let ampm = 'AM';
        
            if (initialValue > 720) {
              ampm = 'PM';
            }
            if (newHourside == 0) {
              newStringHour = '12';
            }
            else if (newHourside < 10) {
              newStringHour = '0' + newHourside;
            }
            else if (newHourside > 12) {
              let newHour = newHourside - 12;
              newStringHour = "0" + newHour.toString();
              if (newHour < 10) {
                newStringHour = '0' + newHour;
              } else {
                newStringHour = '' + newHour;
              }
            }
            if (newMinuteSide < 10) {
              newStringMinute = `0${newMinuteSide}`;
            } else {
              newStringMinute = `${newMinuteSide.toString()}`;
            }
            this.receiveHourFormatValue = newStringHour + ":" + newStringMinute + " " + ampm;
            
          }

          if(config.name == "device_reboot_schedule_end") {
            this.defaultEndTimeValue = config.intValue;
            let initialValue = config.intValue;
            let newHourside = Math.floor(initialValue/ 60);
            let newMinuteSide = initialValue % 60;
            let newStringHour = ""+newHourside;
            let newStringMinute = "";
            let ampm = 'AM';
        
            if (initialValue > 720) {
              ampm = 'PM';
            }
            if (newHourside == 0) {
              newStringHour = '12';
            }
            else if (newHourside < 10) {
              newStringHour = '0' + newHourside;
            }
            else if (newHourside > 12) {
              let newHour = newHourside - 12;
              newStringHour = "0" + newHour.toString();
              if (newHour < 10) {
                newStringHour = '0' + newHour;
              } else {
                newStringHour = '' + newHour;
              }
            }
            if (newMinuteSide < 10) {
              newStringMinute = `0${newMinuteSide}`;
            } else {
              newStringMinute = `${newMinuteSide.toString()}`;
            }
            this.receiveHourFormatEndValue = newStringHour + ":" + newStringMinute + " " + ampm;
            
          }

          if(config.name == "device_reboot_frequency") {
            let initialValue = config.intValue;
            switch(initialValue) {
              case 0:
                this.receiveSelectedDay = "Everyday";
                break;
              case 1:
                this.receiveSelectedDay = "Sunday";
                break;
              case 2:
                this.receiveSelectedDay = "Monday";
                break;
              case 3:
                this.receiveSelectedDay = "Tuesday";
                break;
              case 4:
                this.receiveSelectedDay = "Wednesday";
                break;
              case 5:
                this.receiveSelectedDay = "Thursday";
                break;
              case 6:
                this.receiveSelectedDay = "Friday";
                break;
              case 7:
                this.receiveSelectedDay = "Saturday";
                break;
            }
          }

          if(config.name == "device_time_zone") {
            let convertTime = config.intValue;
            let hour = Math.floor(convertTime/ 60);
            let minute = convertTime%60;
            if(minute<0) {
              let num = minute;
              let stringNum = num.toString();
              stringNum = stringNum.substring(1);
              num = parseInt(stringNum);
              minute=num;
            }
            if(minute >= 0 && minute < 10) {
              if(hour>=0) {
                this.receiveUTCFormatValue = "UTC"+" "+"+"+hour+":"+"0"+minute;
              } else {
                this.receiveUTCFormatValue = "UTC"+" "+hour+":"+"0"+minute;
              }
            } else {
              if(hour>=0) {
                this.receiveUTCFormatValue = "UTC"+" "+"+"+hour+":"+minute;
              } else {
                this.receiveUTCFormatValue = "UTC"+" "+hour+":"+minute;
              }
            }
          }

          if (config.name =='device_reboot_schedule_start') {
            this.iniTimeStart = config.intValue;
          } else if (config.name =='device_reboot_schedule_end') {
            this.iniTimeEnd = config.intValue;
          } else if (config.name == 'Local Time Zone of Device') {
            this.timeZoneInte = config.intValue;
          }
        });
        
        let min1 = 0;
        let hourHand = 0;
        //get hours
        hourHand = (this.iniTimeStart/60);
        //get minutes
        min1 = this.iniTimeStart%60;
        this.iniTimeStart = hourHand;
        this.iniTimeStart = parseInt(this.iniTimeStart);
        
        if(this.iniTimeStart < 10 && min1 < 10) {
          this.iniTimeStart = `0${this.iniTimeStart}:0${min1}`;
        } else if (this.iniTimeStart > 10 && min1 < 10) {
          this.iniTimeStart = `${this.iniTimeStart}:0${min1}`;
        } else if (this.iniTimeStart < 10 && min1 > 10) {
          this.iniTimeStart = `0${this.iniTimeStart}:${min1}`;
        } else {
          this.iniTimeStart = `${this.iniTimeStart}:${min1}`;
        }

        let min2 = 0;
        let hourHand1 = 0;
        //get hours
        hourHand1 = (this.iniTimeEnd/60);
        //get minutes
        min2 = this.iniTimeEnd%60;
        this.iniTimeEnd = hourHand1;
        this.iniTimeEnd = parseInt(this.iniTimeEnd);
        
        if(this.iniTimeEnd < 10 && min2 < 10) {
          this.iniTimeEnd = `0${this.iniTimeEnd}:0${min2}`;
        } else if (this.iniTimeEnd > 10 && min2 < 10) {
          this.iniTimeEnd = `${this.iniTimeEnd}:0${min2}`;
        } else if (this.iniTimeEnd < 10 && min2 > 10) {
          this.iniTimeEnd = `0${this.iniTimeEnd}:${min2}`;
        } else {
          this.iniTimeEnd = `${this.iniTimeEnd}:${min2}`;
        }
        
        this.configValuesLastUpdated = data;
        this.configValuesLastUpdated.lastModifiedDate = String(new Date(this.configValuesLastUpdated.lastModifiedDate).toLocaleString());
      });
    this.subscribers.push(configurationSubscription);



    this.webSocketService.getSocketMessage();
    this.userRoles = JSON.parse(localStorage.getItem('userRoles'));
  }

  updatedSelectedDay(day:string) {
    this.receiveSelectedDay = day;
  }

  receiveTimeData(newHistoryValueTime:any) {
    this.receiveTimeValue = newHistoryValueTime;
  }

  receiveTimeEndData(newHistoryValueTime:any) {
    this.receiveTimeEndValue = newHistoryValueTime;
  }

  receiveAMPMData(data:any) {
    this.receiveAMPMValue = data;
  }

  receiveAMPMEndData(data:any) {
    this.receiveAMPMEndValue = data;
  }

  receiveHourFormatData(time:any) {
    this.receiveHourFormatValue = time;
  }

  receiveHourFormatEndData(time:any) {
    this.receiveHourFormatEndValue = time;
  }

  receiveUTCFormatData(utcData:any) {
    this.receiveUTCFormatValue = utcData;
  }

  getDeviceDetailsData() {
    this.loading = true;
    const deviceSubscription = this.deviceService.getDeviceDetails(this.selectedDeviceId.macid).subscribe((data) => {
      this.deviceData = data;
      this.deviceData.uptime_converted = this.uptime_conversion(this.deviceData.uptime);
      this.deviceData.lastSeen = this.epoc_time_conversion(this.deviceData.lastSeen);
      this.deviceData.dateOfEnrolled = this.epoc_time_conversion(this.deviceData.enrolled_on);
      this.selectedDeviceAppsList = this.deviceData.apps;
      this.logHistory = this.logHistory.replace(/xox/g, this.deviceData.macid);
      this.faultHistory = this.faultHistory.replace(/xox/g, this.deviceData.macid);
      if (this.deviceData.presence === 'Booting' || this.deviceData.presence === 'Offline') {
        this.deviceData.dispensers.forEach((dispenser, index) => {
          dispenser.status = '';
          dispenser.soc = '';
        });
      }
      if (this.userRoles?.SOTA.allowed) {
        this.getAppPackageData();
      } else {
        this.finalAppPackagesList = [];
        this.finalAppPackagesList = this.deviceData.apps;
        this.finalAppPackagesList.forEach(app => {
          app.status = this.titlecasePipe.transform(app.status);
          app.dateOfRelease = new Date(parseInt(app.releaseDate)).toLocaleDateString('en-GB');
          app.dateOfRelease = app.dateOfRelease.replace(/[/]/g, "-");
          app.dateOfRelease = this.deviceService.swap_date_with_month_conversion(app.dateOfRelease, '-');
        });
      }
      this.allDeviceData = data;

      this.deviceData.apps.forEach(device => {
        if (device.systemPackage === true && (device.status === 'Completed' || device.status === undefined)) {
          this.appPackageVersion = device.packageVersion;
        }
      });
      this.deviceData['assembly_serial'] = this.deviceData['assembly_serial'] ? this.deviceData['assembly_serial'].split('|')[3] : '';
    });
    this.subscribers.push(deviceSubscription);
  }

  getAppPackageData() {
    const subscription = this.appPackageService.fectAll().subscribe((data: any) => {
      this.allPackageData = data;
      // if(data.code === 403) {
      //   this.finalAppPackagesList = [];
      //   this.finalAppPackagesList = this.deviceData.apps;

      //   this.finalAppPackagesList.forEach(app => {
      //     app.status = this.titlecasePipe.transform(app.status);
      //   });
      // } else {

      this.allPackageData.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
      const packageList = this.selectedDeviceAppsList.concat(this.allPackageData);
      this.finalAppPackagesList = [];
      packageList.forEach((eachGridData, index) => {
        const eachData = eachGridData;
        const gridIndex = this.finalAppPackagesList.findIndex(
          (d) => d.id === eachData.id
        );
        if (gridIndex === -1) {
          this.finalAppPackagesList.push(eachData);
        }
      });
      this.loading = false;
      this.finalAppPackagesList.forEach(app => {
        app.status = this.titlecasePipe.transform(app.status);
        app.dateOfRelease = new Date(parseInt(app.releaseDate)).toLocaleDateString('en-GB');
        app.dateOfRelease = app.dateOfRelease.replace(/[/]/g, "-");
        app.dateOfRelease = this.deviceService.swap_date_with_month_conversion(app.dateOfRelease, '-');
      });
      // }

      this.finalAppPackagesList.forEach((app, key) => {
        if (app.status === undefined && app.packageVersion?.startsWith('mdc')) {
          this.finalAppPackagesList.splice(key, 1);
        }
      });
    });
    this.subscribers.push(subscription);
  }


  submit() {
    const editDeatils = {
      alias: this.deviceData.alias,
      group: this.deviceData.group,
      location: this.deviceData.location,
      locationZip: this.deviceData.locationZip
    };
    const updateSubscription = this.deviceService
      .updateExistingDevice(this.selectedDeviceId.macid, editDeatils).subscribe(response => {
        this.getDeviceDetailsData();
        this.editModal.hide();
      });

    this.subscribers.push(updateSubscription);
  }

  cancelChanges() {
    const deviceSubscription = this.deviceService.getDeviceDetails(this.selectedDeviceId.macid).subscribe((data) => {
      this.deviceData = data;
      this.editModal.hide();
    });
    this.subscribers.push(deviceSubscription);
  }

  showMoreDetails() {
    this.showMore = !this.showMore;
  }


  goToSecurity(id) {
    this.router.navigate(['/security', this.selectedDeviceId.macid]);
  }


  showModal() {
    this.editModal.show();
  }

  openUpdateHistoryModal() {
    this.getUpdateHistoryData();
  }

  getUpdateHistoryData() {
    const params = new HttpParams()
      .set('pageIndex', this.selectedPageNumSoftware)
      .set('pageSize', this.configSoftware.itemsPerPage)
      .set('sortDirection', this.sortDirectionDescending);

    const subscription = this.deviceService.getUpdateHistoryData(params, this.selectedDeviceId.macid).subscribe((data) => {
      this.updateHistoryData = data.content;
      this.updateHistoryData.forEach(history => {
        let timeConvert = history.timestamp;
        history.timestamp = new Date(parseInt(history.timestamp)).toLocaleDateString('en-GB');
        history.newHistoryValueTime = new Date(parseInt(timeConvert)).toLocaleTimeString('en-GB');
      });
      this.configSoftware.totalItems = data.totalElements;
      this.totalDeviceCountSoftware = data.totalElements;
      this.configSoftware.currentPage = data.number + 1;
      this.noOfElementsSoftware = data.numberOfElements;
      this.updateHistoryModal.show();
    });
    this.subscribers.push(subscription);
  }

  openDeviceHistoryModal() {
    this.getDeviceHistoryData();
  }

  getDeviceFaultsData() {
    var dateTodayLong = (new Date()).valueOf();
    let date30DaysAgoLong = (dateTodayLong - (1000 * 3600 * 24 * 30));
    if (date30DaysAgoLong < 0) {
      date30DaysAgoLong = 0;
    }
    const params = new HttpParams()
      .set('pageIndex', this.selectedPageNum)
      .set('pageSize', this.recentFaultsPaginationConfig.itemsPerPage)
      .set('sortDirection', this.sortDirectionDescending)
      .set('from', String(date30DaysAgoLong))
      .set('to', String(dateTodayLong + (1000 * 3600 * 24))) // tomorrow 12 am local newHistoryValueTime.
      .set('sortKeys', this.sortKeys);

    const subscription = this.deviceService.getDeviceFaultsData(this.selectedDeviceId.macid, params).subscribe((data) => {
      this.deviceRecentFaultsData = data.content;
      this.deviceRecentFaultsData.forEach(recentFaultsElement => {
        recentFaultsElement.timestamp = this.epoc_time_conversion(Date.parse(recentFaultsElement.timestamp));
      });
      this.recentFaultsPaginationConfig.totalItems = data.totalElements;
      this.totalDeviceCount = data.totalElements;
      this.recentFaultsPaginationConfig.currentPage = data.number + 1;
      this.noOfElements = data.numberOfElements;
    });
    this.subscribers.push(subscription);

  }

  getDeviceHistoryData() {
    const params = new HttpParams()
      .set('pageIndex', this.selectedPageNum)
      .set('pageSize', this.configHistory.itemsPerPage)
      .set('sortDirection', this.sortDirectionDescending)
      .set('sortKeys', this.sortKeys);

    const subscription = this.deviceService.getDeviceHistoryData(params, this.selectedDeviceId.macid).subscribe((data) => {
      this.deviceHistoryData = data.content;
      this.deviceHistoryData.forEach(history => {
        let timeConvert: number = Number(history.timestamp) * 1000; // convert seconds to miliseconds 
        history.timestamp = new Date(timeConvert).toLocaleDateString('en-GB');
        history.newHistoryValueTime = new Date(timeConvert).toLocaleTimeString('en-GB');
        if (history.channelId == 'null') {
          history.channelId = 'NA';
        }
      });
      this.deviceHistoryPaginationConfig.totalItems = data.totalElements;
      this.totalDeviceCount = data.totalElements;
      this.deviceHistoryPaginationConfig.currentPage = data.number + 1;
      this.noOfElements = data.numberOfElements;
      this.deviceHistoryModal.show();
    });
    this.subscribers.push(subscription);

  }

  openConfigurationHistoryModal() {
    this.getConfigurationHistoryData();
  }

  getConfigurationHistoryData() {
    const params = new HttpParams()
      .set('pageIndex', this.selectedPageNum)
      .set('pageSize', this.configHistory.itemsPerPage)
      .set('sortDirection', this.sortDirectionDescending);

    const subscription = this.deviceService.getConfigHistoryData(params, this.selectedDeviceId.macid).subscribe((data) => {
      this.configHistoryData = data.content;
      this.configHistoryData.forEach(history => {
        let timeConvert = history.timestamp;
        history.timestamp = new Date(parseInt(history.timestamp)).toLocaleDateString('en-GB');
        history.newHistoryValueTime = new Date(parseInt(timeConvert)).toLocaleTimeString('en-GB');
        
        if(history.status == "device_reboot_frequency changed") {
          let initialNewValue = history.newValue;
          switch(parseInt(initialNewValue)) {
            case 0:
              this.historyDaysNewValueFormat = "Everyday";
              history.newValue = this.historyDaysNewValueFormat;
              break;
            case 1:
              this.historyDaysNewValueFormat = "Sunday";
              history.newValue = this.historyDaysNewValueFormat;
              break;
            case 2:
              this.historyDaysNewValueFormat = "Monday";
              history.newValue = this.historyDaysNewValueFormat;
              break;
            case 3:
              this.historyDaysNewValueFormat = "Tuesday";
              history.newValue = this.historyDaysNewValueFormat;
              break;
            case 4:
              this.historyDaysNewValueFormat = "Wednesday";
              history.newValue = this.historyDaysNewValueFormat;
              break;
            case 5:
              this.historyDaysNewValueFormat = "Thursday";
              history.newValue = this.historyDaysNewValueFormat;
              break;
            case 6:
              this.historyDaysNewValueFormat = "Friday";
              history.newValue = this.historyDaysNewValueFormat;
              break;
            case 7:
              this.historyDaysNewValueFormat = "Saturday";
              history.newValue = this.historyDaysNewValueFormat;
              break;
          }

          let initialOldValue = history.oldValue;
          switch(parseInt(initialOldValue)) {
            case 0:
              this.historyDaysOldValueFormat = "Everyday";
              history.oldValue = this.historyDaysOldValueFormat;
              break;
            case 1:
              this.historyDaysOldValueFormat = "Sunday";
              history.oldValue = this.historyDaysOldValueFormat;
              break;
            case 2:
              this.historyDaysOldValueFormat = "Monday";
              history.oldValue = this.historyDaysOldValueFormat;
              break;
            case 3:
              this.historyDaysOldValueFormat = "Tuesday";
              history.oldValue = this.historyDaysOldValueFormat;
              break;
            case 4:
              this.historyDaysOldValueFormat = "Wednesday";
              history.oldValue = this.historyDaysOldValueFormat;
              break;
            case 5:
              this.historyDaysOldValueFormat = "Thursday";
              history.oldValue = this.historyDaysOldValueFormat;
              break;
            case 6:
              this.historyDaysOldValueFormat = "Friday";
              history.oldValue = this.historyDaysOldValueFormat;
              break;
            case 7:
              this.historyDaysOldValueFormat = "Saturday";
              history.oldValue = this.historyDaysOldValueFormat;
              break;
          }
        }
        if(history.status == "device_time_zone changed") {
          let newHistoryValueTime = history.newValue;
          let newHourside = Math.floor(newHistoryValueTime/ 60);
          let newMinuteSide = newHistoryValueTime % 60;
          let newStringHour = ""+newHourside;
          let newStringMinute = "";
        
          // if(newHistoryValueTime>720){
          //   ampm = 'PM';
          // }
          if(newHourside == 0){
            newStringHour = '12';
          }
          // else if(newHourside < 10){
          //   newStringHour = '0'+newHourside;
          // }
          else if(newHourside>12){
            let newHour = newHourside-12;
            newStringHour = newHour.toString();
            // if(newHourside<10){
            //   newStringHour = ''+newHourside;
            // }
          }
          if(newMinuteSide<10){
            newStringMinute = `0${newMinuteSide}`;
          }else{
            newStringMinute = `${newMinuteSide.toString()}`;
          }
          
          if(newHourside>=0) {
            newStringHour= "+"+newStringHour;
          }

          this.historyUTCHourNewValueTimeFormat = "UTC"+" "+newStringHour+":"+newStringMinute;
          history.newValue = this.historyUTCHourNewValueTimeFormat;

          let oldHistoryValueTime = history.oldValue;
          let oldHourside = Math.floor(oldHistoryValueTime/ 60);
          let oldMinuteSide = oldHistoryValueTime % 60;
          let oldStringHour = `${oldHourside.toString()}`;
          let oldStringMinute = "";

          if(oldHourside == 0){
            oldStringHour = '12';
          }
          // else if(oldHourside < 10){
          //   oldStringHour = '0'+oldHourside;
          // }
          else if(oldHourside>12){
            let oldHour = oldHourside-12;
            oldStringHour = oldHour.toString();
            // oldHourside = oldHourside-12;
            // if(oldHourside<10){
            //   oldStringHour = '0'+oldHourside;
            // }else{
            //   oldStringHour = ''+oldHourside;
            // }
          }
          if(oldMinuteSide<10){
            oldStringMinute = '0'+oldMinuteSide;
          }else{
            oldStringMinute = ''+oldMinuteSide;
          }
          if(oldHourside>=0) {
            oldStringHour= "+"+oldStringHour;
          }
  
          this.historyUTCHourOldValueTimeFormat = "UTC"+" "+oldStringHour+":"+oldStringMinute;
          history.oldValue = this.historyUTCHourOldValueTimeFormat;
        }

        if(history.status == "device_reboot_schedule_start changed") {
          let initialValue = history.newValue;
          let newHourside = Math.floor(initialValue/ 60);
          let newMinuteSide = initialValue % 60;
          let newStringHour = ""+newHourside;
          let newStringMinute = "";
          let ampm = 'AM';
      
          if (initialValue > 720) {
            ampm = 'PM';
          }
          if (newHourside == 0) {
            newStringHour = '12';
          }
          else if (newHourside < 10) {
            newStringHour = '0' + newHourside;
          }
          else if (newHourside > 12) {
            let newHour = newHourside - 12;
            newStringHour = "0" + newHour.toString();
            if (newHour < 10) {
              newStringHour = '0' + newHour;
            } else {
              newStringHour = '' + newHour;
            }
          }
          if (newMinuteSide < 10) {
            newStringMinute = `0${newMinuteSide}`;
          } else {
            newStringMinute = `${newMinuteSide.toString()}`;
          }
          this.historyHourNewValueTimeFormat = newStringHour + ":" + newStringMinute + " " + ampm;
          history.newValue = this.historyHourNewValueTimeFormat;

          let initialOldValue = history.oldValue;
          let newHoursideOld = Math.floor(initialOldValue/ 60);
          let newMinuteSideOld = initialOldValue % 60;
          let newStringHourOld = ""+newHoursideOld;
          let newStringMinuteOld = "";
          let ampmOld = 'AM';
      
          if (initialOldValue > 720) {
            ampm = 'PM';
          }
          if (newHoursideOld == 0) {
            newStringHourOld = '12';
          }
          else if (newHoursideOld < 10) {
            newStringHourOld = '0' + newHoursideOld;
          }
          else if (newHoursideOld > 12) {
            let newHour = newHoursideOld - 12;
            newStringHourOld = "0" + newHour.toString();
            if (newHour < 10) {
              newStringHourOld = '0' + newHour;
            } else {
              newStringHourOld = '' + newHour;
            }
          }
          if (newMinuteSideOld < 10) {
            newStringMinuteOld = `0${newMinuteSideOld}`;
          } else {
            newStringMinuteOld = `${newMinuteSideOld.toString()}`;
          }
          this.historyHourNewValueTimeFormat = newStringHourOld + ":" + newStringMinuteOld + " " + ampmOld;
          history.oldValue = this.historyHourNewValueTimeFormat;
        }

        if(history.status == "device_reboot_schedule_end changed") {
          let initialValue = history.newValue;
          let newHourside = Math.floor(initialValue/ 60);
          let newMinuteSide = initialValue % 60;
          let newStringHour = ""+newHourside;
          let newStringMinute = "";
          let ampm = 'AM';
      
          if (initialValue > 720) {
            ampm = 'PM';
          }
          if (newHourside == 0) {
            newStringHour = '12';
          }
          else if (newHourside < 10) {
            newStringHour = '0' + newHourside;
          }
          else if (newHourside > 12) {
            let newHour = newHourside - 12;
            newStringHour = "0" + newHour.toString();
            if (newHour < 10) {
              newStringHour = '0' + newHour;
            } else {
              newStringHour = '' + newHour;
            }
          }
          if (newMinuteSide < 10) {
            newStringMinute = `0${newMinuteSide}`;
          } else {
            newStringMinute = `${newMinuteSide.toString()}`;
          }
          this.historyHourNewValueTimeFormat = newStringHour + ":" + newStringMinute + " " + ampm;
          history.newValue = this.historyHourNewValueTimeFormat;

          let initialOldValue = history.oldValue;
          let newHoursideOld = Math.floor(initialOldValue/ 60);
          let newMinuteSideOld = initialOldValue % 60;
          let newStringHourOld = ""+newHoursideOld;
          let newStringMinuteOld = "";
          let ampmOld = 'AM';
      
          if (initialOldValue > 720) {
            ampm = 'PM';
          }
          if (newHoursideOld == 0) {
            newStringHourOld = '12';
          }
          else if (newHoursideOld < 10) {
            newStringHourOld = '0' + newHoursideOld;
          }
          else if (newHoursideOld > 12) {
            let newHour = newHoursideOld - 12;
            newStringHourOld = "0" + newHour.toString();
            if (newHour < 10) {
              newStringHourOld = '0' + newHour;
            } else {
              newStringHourOld = '' + newHour;
            }
          }
          if (newMinuteSideOld < 10) {
            newStringMinuteOld = `0${newMinuteSideOld}`;
          } else {
            newStringMinuteOld = `${newMinuteSideOld.toString()}`;
          }
          this.historyHourNewValueTimeFormat = newStringHourOld + ":" + newStringMinuteOld + " " + ampmOld;
          history.oldValue = this.historyHourNewValueTimeFormat;
        }
        
        
      });

      this.configHistory.totalItems = data.totalElements;
      this.totalDeviceCount = data.totalElements;
      this.configHistory.currentPage = data.number + 1;
      this.noOfElements = data.numberOfElements;
      this.configurationUpdateHistoryModal.show();
    });
    this.subscribers.push(subscription);

  }

  /* tab selection functionality */
  changeTabSelection(tabName) {
    this.selectedTabName = tabName;
  }

  selectGroupName(groupName) {
    // this.editDeviceForm.setValue({'group' : groupName});
    this.deviceData.group = groupName;
  }



  goToFirmware() {
    // tslint:disable-next-line:max-line-length
    this.router.navigate(['/firmware'], { queryParams: { serial: this.selectedDeviceId.macid, updateType: 2, selectedDevice: JSON.stringify(this.deviceData) }, skipLocationChange: false });
  }
  changeConfigurations() {
    this.configValues.forEach(value => {
      value.disabled = true;
    });
    this.configValuesCopy = JSON.parse(JSON.stringify(this.configValues));
    this.configuarationUpdateModal.show();
  }

  cancelConfigChanges() {
    const configurationSubscription = this.configurationService
      .getConfigValues(this.deviceData.serial).subscribe((data: ConfigurationsResponse) => {
        this.configValues = data.configs;
      });
    this.subscribers.push(configurationSubscription);
    this.configuarationUpdateModal.hide();
  }

  updatedConfigValues(configValues) {
    configValues.forEach((config) => { delete config.disabled; });
    const values = {
      configuration: {
        configs: configValues
      },
      devices: [this.deviceData]
    };



    const updateConfigurationSubscription = this.configurationService.updateConfigValues(values).subscribe(data => {

      const configurationSubscription = this.configurationService
        .getConfigValues(this.deviceData.serial).subscribe((response: ConfigurationsResponse) => {
          console.log("Serial Id",this.deviceData.serial );
          this.configValues = response.configs;
          this.configValuesLastUpdated = response;
          this.configValuesLastUpdated.lastModifiedDate = String(new Date(this.configValuesLastUpdated.lastModifiedDate).toLocaleString());

          this.toastrService.show(
            `<img src="../../assets/images/success.svg"  alt="icon">
          <span> &nbsp&nbsp&nbsp Configuration update  initiated successfully </span>`,
            ' ',
            {
              enableHtml: true,
              titleClass: 'background',
              positionClass: 'toast-top-center',
            }
          );
        });

      this.subscribers.push(configurationSubscription);
    });

    this.subscribers.push(updateConfigurationSubscription);

    this.configuarationUpdateModal.hide();
  }

  onSelectAppPackage(appPackage) {
    this.selectedApp = appPackage.systemPackage ? appPackage.packageVersion : appPackage.packageName;
    this.selectedAppId = appPackage.id;
    this.updateDeviceAppModal.show();
  }
  updateDeviceApp() {
    const values = {
      devices: [this.deviceData],
      force: false,
      restart: this.restartDevice,
      softwarePackageId: this.selectedAppId
    };
    const updateAppSubscription = this.appPackageService.updateDevicesApp(values).subscribe((data => {
      if (data.length === 0) {
        this.updateDeviceAppForceTrue();
      } else {
        this.toastrService.error('Selected version is not compatible', '', {
          timeOut: 3000,
          positionClass: 'toast-top-center',
        });
      }
    }));
    this.subscribers.push(updateAppSubscription);
    this.updateDeviceAppModal.hide();
  }

  updateDeviceAppForceTrue() {
    const values = {
      devices: [this.deviceData],
      force: true,
      restart: this.restartDevice,
      softwarePackageId: this.selectedAppId
    };
    const updateAppSubscription = this.appPackageService.updateDevicesApp(values).subscribe((data => {
      this.toastrService.show(
        '<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp Device app update initiated  </span>',
        ' ',
        {
          enableHtml: true,
          titleClass: 'background',
          positionClass: 'toast-top-center',
        }
      );
      this.appPackageService.resetValues();
      this.restartDevice = false;
      this.getDeviceDetailsData();
    }));
    this.subscribers.push(updateAppSubscription);
    this.updateDeviceAppModal.hide();
  }

  onUnInstallAppPackage(appPackage) {
    this.selectedApp = appPackage.packageName;
    this.selectedAppId = appPackage.id;
    this.unInstallConfirmatopnModal.show();
  }

  uninstallAppPackage() {
    const values = {
      devices: [this.deviceData],
      force: true,
      restart: 'false',
      softwarePackageId: this.selectedAppId
    };
    const updateAppSubscription = this.appPackageService.unInstallAppPackage(values).subscribe((data => {
      this.toastrService.show(
        '<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp Device app uninstalled  </span>',
        ' ',
        {
          enableHtml: true,
          titleClass: 'background',
          positionClass: 'toast-top-center',
        }
      );
      this.appPackageService.resetValues();
      this.unInstallConfirmatopnModal.hide();
      this.getDeviceDetailsData();
    }));
    this.subscribers.push(updateAppSubscription);
  }
  getReleaseNotes(data) {
    this.releaseNotesModal.show();
    this.markdownReleaseNotes =
      `
        ${data.changeLog ? data.changeLog : '### No release notes available'}
      `;
    this.modalHeaderText = data.systemPackage ? data.packageVersion : data.packageName;
  }
  closePopUp() {
    this.updateDeviceAppModal.hide();
    this.restartDevice = false;
  }
  onCancel(appPackage) {
    this.appPackageJobId = appPackage.jobId;
    this.cancelAppInstallationModal.show();
  }
  onReInstallAppPackage(appPackage) {
    this.selectedAppId = appPackage.id;
    this.updateDeviceApp();
  }
  cancelInstallation() {
    this.appPackageService.cancelAppPackageInstallationForPendingStatus(this.deviceData.serial, this.appPackageJobId).subscribe((data) => {
      this.toastrService.show(
        '<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp App Installation cancelled </span>',
        ' ',
        {
          enableHtml: true,
          titleClass: 'background',
          positionClass: 'toast-top-center',
        }
      );
      this.cancelAppInstallationModal.hide();
      this.getDeviceDetailsData();
    });
    this.cancelAppInstallationModal.hide();
  }

  pageChangeRecentFaults(pageNumber: number) {
    this.selectedPageNum = pageNumber - 1;
    this.getDeviceFaultsData();
    this.recentFaultsPaginationConfig.currentPage = pageNumber;
  }

  pageChangeDeviceHistory(pageNumber: number) {
    this.selectedPageNum = pageNumber - 1;
    this.getDeviceHistoryData();
    this.deviceHistoryPaginationConfig.currentPage = pageNumber;
  }

  pageChange(pageNumber: number) {
    this.selectedPageNum = pageNumber - 1;
    this.getConfigurationHistoryData();
    this.configHistory.currentPage = pageNumber;
  }

  pageChangeSoftware(pageNumber: number) {
    this.selectedPageNumSoftware = pageNumber - 1;
    this.getUpdateHistoryData();
    this.configSoftware.currentPage = pageNumber;
  }

  rebootDevice() {
    this.deviceService.restartDevice(this.selectedDeviceId.macid).subscribe(data => {
      this.toastrService.show(
        '<img src="../../assets/images/success.svg"  alt="icon"><span> &nbsp&nbsp&nbsp Reboot initiated </span>',
        ' ',
        {
          enableHtml: true,
          titleClass: 'background',
          positionClass: 'toast-top-center',
        }
      );
    });
  }


  ngDoCheck() {
    const socketJobStatusObject = JSON.parse(sessionStorage.getItem('socketObject'));
    let found = false;
    if (socketJobStatusObject) {
      socketJobStatusObject.forEach(device => {
        if (device.deviceSerial === this.selectedDeviceId.macid) {
          if ((device.type === 'JobNotification' || device.type === 'DispenserUpdateNotification') && device.deviceSerial === this.selectedDeviceId.macid) {
            found = true;
            return;
          }

          if (this.deviceData) {
            if (device.type === 'uptime' && device.deviceSerial === this.selectedDeviceId.macid) {
              this.deviceData.uptime_converted = this.uptime_conversion(device.message);
            }
            if (device.type === 'lastseen' && device.deviceSerial === this.selectedDeviceId.macid) {
              this.deviceData.lastSeen = new Date(parseInt(device.message)).toLocaleString('en-GB');
              this.deviceData.lastSeen = this.deviceData.lastSeen.replace(/[/]/g, "-");
              this.deviceData.lastSeen = this.deviceData.lastSeen.replace(/,/g, "");
              this.deviceData.lastSeen = this.deviceService.swap_date_with_month_conversion(this.deviceData.lastSeen, '-');
            }
          }


          if (this.deviceData?.dispensers) {
            this.deviceData.dispensers.forEach((dispenser, index) => {
              device.dispensers.forEach((socketDispenser, SocketIndex) => {
                if (dispenser.ccsomdevid !== null && dispenser.ccsomdevid !== '' 
                  && socketDispenser.id !== null && socketDispenser.id !== '' && socketDispenser.status !== '' && socketDispenser.status !== null) {
                  if (this.deviceData.dispensers.length > 0 && (this.deviceData.dispensers.length <= device.dispensers.length)) {
                    if(this.deviceData && this.deviceData.dispensers[SocketIndex]){
                      this.deviceData.dispensers[SocketIndex].status = socketDispenser.status;
                      this.deviceData.dispensers[SocketIndex].soc = socketDispenser.soc;
                    }
                  }
                }
              });
            });
          }



          if (device.deviceSerial === this.selectedDeviceId.macid && device.type !== 'uptime' && device.type !== 'lastseen') {
            this.deviceData.presence = device.type;
            if (this.deviceData.presence === 'Offline') {
              this.deviceData.dispensers.forEach((dispenser, index) => {
                dispenser.status = '';
                dispenser.soc = '';
              });
            }
          }

          if (device.emm.enabled === true) {
            this.emm = 'EMM';
          } else if (device.emm.enabled === false) {
            this.emm = "Default";
          } else {
            this.emm = 'NA';
          }

          if (this.deviceData && this.deviceData.emm && device.deviceSerial === this.selectedDeviceId.macid && (device.type === 'Idle' || device.type === 'Booting'
            || device.type === 'Charging' || device.type === 'Faulted')) {
            this.deviceData.emm.ocppId = device.emm.ocppId;
            this.deviceData.emm.topOffSoc = device.emm.topOffSoc;
            this.deviceData.emm.bulkSoc = device.emm.bulkSoc;
            this.deviceData.emm.forceSwitch = device.emm.forceSwitch;
          }

          if (this.deviceData && this.deviceData.emm && device.deviceSerial === this.selectedDeviceId.macid && device.type === 'Offline') {
            this.deviceData.emm.ocppId = '-';
            this.deviceData.emm.topOffSoc = 0;
            this.deviceData.emm.bulkSoc = 0;
            this.deviceData.emm.forceSwitch = false;
          }

          if (device.deviceSerial === this.selectedDeviceId.macid && device.type === 'DispenserUpdateNotification') {
            this.getDeviceDetailsData();
            if (this.deviceHistoryModal.isShown) {
              this.getDeviceHistoryData();
            }
          }
        }
      });
      if (found && this.loading === false) {
        this.getDeviceDetailsData();
        sessionStorage.removeItem('socketObject');
        return;
      }
    }
  }

  uptime_conversion(uptime) {
    let totalSeconds = uptime;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let uptime_converted = hours + ":" + minutes + ":" + seconds;
    return uptime_converted;
  }

  epoc_time_conversion(newHistoryValueTime) {
    let time_converted;
    time_converted = new Date(parseInt(newHistoryValueTime)).toLocaleString('en-GB');
    time_converted = time_converted.replace(/[/]/g, "-");
    time_converted = time_converted.replace(/,/g, "");
    time_converted = this.deviceService.swap_date_with_month_conversion(time_converted, '-');
    return time_converted;
  }

  logsFaultsLink() {
    this.router.navigate(
      ['/logsfaults', this.selectedDeviceId.macid],
      {
        queryParams: {
          deviceAlias: this.deviceData?.alias
        }
      }
    );
  }

  faultHistoryLink() {
    this.deviceService.getKibanaUrl().subscribe((data) => {
      this.faultHistory = data.deviceFaultUrl;
      this.faultHistory = this.faultHistory.replace(/xox/g, this.deviceData.macid);
      window.open(this.faultHistory, '_blank');
    });
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    const configurationSubscription = this.configurationService
      .getConfigValues(this.deviceData.serial).subscribe((data: ConfigurationsResponse) => {
        this.configValues = data.configs;
      });
    this.subscribers.push(configurationSubscription);
  }
}
