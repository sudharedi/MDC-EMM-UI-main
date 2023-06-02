import { TestBed } from '@angular/core/testing';

import { TimerService } from './timer.service';
import { CognitoService } from 'src/app/auth/cognito.service';

describe('TimerService', () => {
  let service: TimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CognitoService]
    });
    service = TestBed.inject(TimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call stopTimer()', () => {
    spyOn(service, 'stopTimer').and.callThrough();
    service.stopTimer();
    expect(service.stopTimer).toHaveBeenCalled();
  });

  it('should call getTime()', () => {
    spyOn(service, 'getTime').and.callThrough();
    service.getTime();
    expect(service.getTime).toHaveBeenCalled();
  });

  it('should call refreshEveryHour()', () => {
    spyOn(service, 'refreshEveryHour').and.callThrough();
    service.refreshEveryHour(CognitoService, CognitoService);
    expect(service.stopTimer).toHaveBeenCalled();
  });
});
