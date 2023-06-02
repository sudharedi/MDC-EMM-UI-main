import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  public socketMessageArray: any;
  constructor() { }

  getSocketMessage() {
    let stompClient;
    const jobStatusObject: any[] = [];
    let token = localStorage.getItem('token');
    const socket = new SockJS('https://dev-mdc-monitor.proterra.com/notifications?Authorization='+token);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function() {
      stompClient.subscribe('/topic/messages', response => {
        const socketMessage: any[] = [];
        const self = this;
        socketMessage.push(JSON.parse(response?.body));
        sessionStorage.setItem('socketObject', JSON.stringify(socketMessage));
        sessionStorage.setItem('socketObjectEventLogs', JSON.stringify(socketMessage));
      });
    });
  }

  socketStatus(serialNo, status) {
    const retrievedObject = JSON.parse(sessionStorage.getItem('socketObject'));
    let matchedRecord;
    if (retrievedObject) {
      retrievedObject.forEach(serial => {
        if (serial.deviceSerial === serialNo && serial.type !== 'uptime' && serial.type !== 'lastseen' ) {
          matchedRecord = serial;
        }
      });
    }
    return matchedRecord?.type ? matchedRecord.type : (status ? status : 'NA');
  }

  socketUptime(serialNo, uptime) {
    const retrievedObject = JSON.parse(sessionStorage.getItem('socketObject'));
    let matchedRecordUptime;
    if (retrievedObject) {
      retrievedObject.forEach(serial => {
        if (serial.deviceSerial === serialNo && serial.type === 'uptime') {
          serial.message = parseInt(serial.message);
          matchedRecordUptime = serial;
        }
      });
    }
    return matchedRecordUptime?.type ? matchedRecordUptime.message : (uptime ? uptime : 'NA');
  }
}
