import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseComponent } from '../base-component.component';
import { ConfigurationService } from './configuration.service';
import { type } from 'os';
const ct = require('countries-and-timezones');

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent extends BaseComponent implements OnInit {
  @Input() configValues;
  @Input() configValuesCopy;
  @Input() noOfDevices;
  @Input() updateType;
  @Input() totalDeviceCount;
  @Input() iniTimeStart;
  @Input() iniTimeEnd;
  @Input() timeZoneInte;
  @Input() defaultStartTimeData;
  @Input() defaultEndTimeData;
  @Output() cancelChanges: EventEmitter<any> = new EventEmitter();
  @Output() updatedConfigValues: EventEmitter<any> = new EventEmitter();
  @Output() updatedSelectedDayEvent = new EventEmitter<string>();
  @Output() receiveTimeDataEvent = new EventEmitter<any>();
  @Output() receiveTimeDataEndEvent = new EventEmitter<any>();
  @Output() receiveAMPMDataEvent = new EventEmitter<any>();
  @Output() receiveAMPMDataEndEvent = new EventEmitter<any>();
  @Output() receiveTwelveHourDataEvent = new EventEmitter<any>();
  @Output() receiveTwelveHourDataEndEvent = new EventEmitter<any>();
  @Output() receiveUTCFormatDataEvent = new EventEmitter<any>();
  @ViewChild('configurationForm') configForm: NgForm;
  // timezones = listTz();
  // selectedTimezone = clientTz();
  tzNames:string[];

  isInputChnaged = true;
  disableSubmit = true;
  chargingSequence = [0, 0, 0, 0];
  chargingSequenceRangeError = false;
  chargingSequenceDuplicates = false;
  selectedConfigFields = [];
  userRoles;
  dayField = 'Sunday';
  inteTimeStart: any;
  inteTimeEnd:any;
  selectedDay:string;
  autoRebootScheduleAMPM:string;
  autoRebootScheduleEndAMPM:string;
  twelveHourFormat:any;
  twelveHourEndFormat:any;
  convertToUTCFormat:any;
  offsetTimezone = 'Asia/Calcutta';
  showOffset = true;
  arr = [];

  constructor(private configurationService: ConfigurationService) {
    super();
  }

  ngOnInit(): void {
    this.userRoles = JSON.parse(localStorage.getItem('userRoles'));
    
    const timezones = ct.getAllTimezones();

    // console.log(countries)

    // console.log(timezones);
    for (const property in timezones) {
      // console.log(property)
      // console.log(`${timezones[property].utcOffsetStr}`)
      let obj = {
        name: property,
        value: `UTC (${timezones[property].utcOffsetStr}) ${timezones[property].name}`
      }

      this.arr.push(obj);
      console.log(`${property}: ${timezones[property].utcOffsetStr}`);
    }
  }

  onSubmit(configValues) {
    configValues.forEach((value, key) => {

      if (value.name === 'charge_seq') {
        if (value.name === 'charge_seq' && !value.disabled ) {
          value.strValue = this.chargingSequence.toString();
        } else if (value.name === 'charge_seq' && value.disabled ) {
          value.strValue = this.configValuesCopy[key].strValue;
        }
      }

      if (value.name === 'device_reboot_schedule_start') {
        value.intValue = this.inteTimeStart;
      } else if(value.name === "device_reboot_schedule_end") {
        value.intValue = this.inteTimeEnd;
      } else if (value.name === 'device_time_zone') {
        value.intValue = this.timeZoneInte;
      }
    });
    this.updatedConfigValues.emit(configValues);
    this.chargingSequence = [0, 0, 0, 0];
  }


  selectedConfigFileds(event, index) {
    this.configValues.forEach((value, key) => {
      if (key === index) {
        value.disabled = !value.disabled;
        value.dirty = true;
        this.isInputChnaged = false;
      } else {

      }
    });

    if (!event.target.checked) {
      if (this.configValues[index].type === 'number') {
        this.configValues[index].intValue = this.configValuesCopy[index].intValue;
        this.configValues[index].dirty = false;
      } else if (this.configValues[index].type === 'text') {
        this.configValues[index].strValue = this.configValuesCopy[index].strValue;
        this.configValues[index].dirty = false;
      } else if (this.configValues[index].type === 'boolean') {
        this.configValues[index].boolValue = this.configValuesCopy[index].boolValue;
        this.configValues[index].dirty = false;
      }
    }

    if (!event.target.checked) {
      if (this.configValues[index].type === 'number') {
        this.selectedConfigFields.forEach((configFileds, configKey) => {
          if (this.configValues[index].name === configFileds) {
            this.selectedConfigFields.splice(configKey, 1);
          }
        });
      }
    }

    if (!event.target.checked && event.target.name === 'charge_seq') {
      this.chargingSequenceDuplicates = false;
      this.chargingSequenceRangeError = false;
    }

    if (this.selectedConfigFields.length > 0) {
      this.disableSubmit = true;
    } else {
      this.disableSubmit = false;
    }
  }

  cancel() {
    this.chargingSequence = [0, 0, 0, 0];
    this.chargingSequenceRangeError = false;
    this.chargingSequenceDuplicates = false;
    this.disableSubmit = false;
    this.cancelChanges.emit();
  }

  checkValidation(value, index) {
    this.configValues.forEach((configValue, key) => {
      if ( key === index && configValue.type === 'number' && configValue.name !== 'charge_seq') {

        if (value < configValue.minimum || value > configValue.maximum || value === null  || !Number.isInteger(value)) {
          this.selectedConfigFields.push(configValue.name);
          this.selectedConfigFields = [...new Set(this.selectedConfigFields)];
        } else {
          this.selectedConfigFields.forEach((fileds, fieldsIndex) => {
            if (configValue.name === fileds) {
              this.selectedConfigFields.splice(fieldsIndex, 1);
            }
          });
        }
      }
    });


    if (this.selectedConfigFields.length > 0) {
      this.disableSubmit = true;
    } else {
      this.disableSubmit = false;
    }
  }

  chargingSequenceValidation() {
    let countZero = 0;
    let countOne = 0;
    let countTwo = 0;
    let countThree = 0;
    let countFour = 0;
    this.chargingSequence.forEach((value, key) => {
      if (value === 0) {
        countZero++;
      } else if ( value === 1) {
        countOne++;
      } else if (value === 2) {
        countTwo++;
      } else if (value === 3) {
        countThree++;
      } else if (value === 4) {
        countFour++;
      } else {

      }
    });

    if ( countZero === 4 || countOne > 1 || countTwo > 1 || countThree > 1 || countFour > 1 ) {
      this.chargingSequenceDuplicates = true;
    } else {
      this.chargingSequenceDuplicates = false;
    }


    if (this.chargingSequence[0] > 4 || this.chargingSequence[1] > 4 || this.chargingSequence[2] > 4 || this.chargingSequence[3] > 4
      || this.chargingSequence[0] < 0 || this.chargingSequence[1] < 0 || this.chargingSequence[2] < 0 || this.chargingSequence[3] < 0
      || this.chargingSequence[0] === null || this.chargingSequence[1] === null
      || this.chargingSequence[2] === null || this.chargingSequence[3] === null) {
      this.chargingSequenceRangeError = true;
    } else {
      this.chargingSequenceRangeError = false;
    }

  }

  selectDay(event: any) {
    this.dayField = event;
    switch(parseInt(this.dayField)) {
      case 0:
        this.updatedSelectedDayEvent.emit(this.selectedDay = "Everyday");
        break;
      case 1:
        this.updatedSelectedDayEvent.emit(this.selectedDay = "Sunday");
        break;
      case 2:
        this.updatedSelectedDayEvent.emit(this.selectedDay = "Monday");
        break;
      case 3:
        this.updatedSelectedDayEvent.emit(this.selectedDay = "Tuesday");
        break;
      case 4:
        this.updatedSelectedDayEvent.emit(this.selectedDay = "Wednesday");
        break;
      case 5:
        this.updatedSelectedDayEvent.emit(this.selectedDay = "Thursday");
        break;
      case 6:
        this.updatedSelectedDayEvent.emit(this.selectedDay = "Friday");
        break;
      case 7:
        this.updatedSelectedDayEvent.emit(this.selectedDay = "Saturday");
        break;
    }
  }

  changeTime(event: any) {
    if (event.target.name == "device_reboot_schedule_start") {
      let time1 = event.target.value;
      let totalMin1 = 0;

      if (time1.substring(0, 1) <= 12) {
        let hourHand = parseInt(time1.substring(0, 2)) * 60;
        let minuteHand = parseInt(time1.substring(3, 5));
        totalMin1 = hourHand + minuteHand;
      } else {
        let hourHand = parseInt(time1.substring(0, 2)) * 60;
        let minuteHand = parseInt(time1.substring(2, 5));
        totalMin1 = hourHand + minuteHand;
      }
      let hour1 = time1.substring(0, 2);
      let minute1 = time1.substring(3, 5);
      this.twelveHourFormat = hour1 + ":" + minute1;
      this.autoRebootScheduleAMPM = "AM";
      if (hour1 == 0) {
        hour1 = 12;
        this.twelveHourFormat = hour1 + ":" + minute1;
      } else if (hour1 > 12) {
        hour1 = hour1 - 12;
        if (hour1 < 10) {
          this.twelveHourFormat = "0" + hour1 + ":" + minute1;
        } else {
          this.twelveHourFormat = hour1 + ":" + minute1;
        }

        this.autoRebootScheduleAMPM = "PM";
      }
      this.iniTimeStart = time1;
      this.inteTimeStart = totalMin1;
      this.receiveTimeDataEvent.emit(this.inteTimeStart);
      this.receiveAMPMDataEvent.emit(this.autoRebootScheduleAMPM);
      this.receiveTwelveHourDataEvent.emit(this.twelveHourFormat);
    }

    if(event.target.name == "device_reboot_schedule_end") {
      let time = event.target.value
      let totalMin = 0;

      if (time.substring(0, 1) <= 12) {
        let hourHand = parseInt(time.substring(0, 2)) * 60;
        let minuteHand = parseInt(time.substring(3, 5));
        totalMin = hourHand + minuteHand;
      } else {
        let hourHand = parseInt(time.substring(0, 2)) * 60;
        let minuteHand = parseInt(time.substring(2, 5));
        totalMin = hourHand + minuteHand;
      }
      let hour = time.substring(0, 2);
      let minute = time.substring(3, 5);
      this.twelveHourEndFormat = hour + ":" + minute;
      this.autoRebootScheduleEndAMPM = "AM";
      if (hour == 0) {
        hour = 12;
        this.twelveHourEndFormat = hour + ":" + minute;
      } else if (hour > 12) {
        hour = hour - 12;
        if (hour < 10) {
          this.twelveHourEndFormat = "0" + hour + ":" + minute;
        } else {
          this.twelveHourEndFormat = hour + ":" + minute;
        }

        this.autoRebootScheduleEndAMPM = "PM";
      }
      this.iniTimeEnd = time;
      this.inteTimeEnd = totalMin;
      this.receiveTimeDataEndEvent.emit(this.inteTimeEnd);
      this.receiveAMPMDataEndEvent.emit(this.autoRebootScheduleEndAMPM);
      this.receiveTwelveHourDataEndEvent.emit(this.twelveHourEndFormat);
    }
    
  }
  selectTimezone(event: any) {
    let timeZoneWithSign = event.target.value;
    let getActualTimeWithSign = timeZoneWithSign.substring(5,11);
    console.log(getActualTimeWithSign);
    let sign = getActualTimeWithSign[0];
    let time = getActualTimeWithSign.substring(1,);
    let totalMin = 0;
    let totalMinSign = '';
    if (time.substring(0, 1) <= 12) {
      let hourHand = parseInt(time.substring(0, 2)) * 60;
      let minuteHand = parseInt(time.substring(3, 5));
      totalMin = hourHand + minuteHand;
    } else {
      let hourHand = parseInt(time.substring(0, 2)) * 60;
      let minuteHand = parseInt(time.substring(2, 5));
      totalMin = hourHand + minuteHand;
    }
    totalMinSign = `${sign}${totalMin}`;
    this.timeZoneInte = parseInt(totalMinSign);

    let convertTime = this.timeZoneInte;
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
        this.convertToUTCFormat = "UTC"+" "+"+"+hour+":"+"0"+minute;
      } else {
        this.convertToUTCFormat = "UTC"+" "+hour+":"+"0"+minute;
      }
    } else {
      if(hour>=0) {
        this.convertToUTCFormat = "UTC"+" "+"+"+hour+":"+minute;
      } else {
        this.convertToUTCFormat = "UTC"+" "+hour+":"+minute;
      }
    }
    this.receiveUTCFormatDataEvent.emit(this.convertToUTCFormat);
    console.log("converted data",this.convertToUTCFormat);
  }
}
