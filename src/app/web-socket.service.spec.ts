import { TestBed } from '@angular/core/testing';

import { WebSocketService } from './web-socket.service';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';


describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        }),
        RouterTestingModule
      ],
      providers: [WebSocketService]
    });
    service = TestBed.inject(WebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getSocketMessage', () => {
    spyOn(service, 'getSocketMessage').and.callThrough();
    service.getSocketMessage();
    expect(service.getSocketMessage).toHaveBeenCalled();
  });

  it('should call socketStatus', () => {
    spyOn(service, 'socketStatus').and.callThrough();
    service.socketStatus('189ba5405bcc', 'online');
    expect(service.socketStatus).toHaveBeenCalled();
  });

  it('should call socketUptime', () => {
    spyOn(service, 'socketUptime').and.callThrough();
    service.socketUptime('189ba5405bcc', '12344');
    expect(service.socketUptime).toHaveBeenCalled();
  });
});
