import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { observable, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private time$ = new BehaviorSubject<Date>(new Date());
  private timerRef;
  private timerOneMinRefreshRef;
  private blnStopRefreshAction: boolean = false;
  obsTimer: Observable<number> = timer(0, 60000);

  constructor() {
    this.startTimer();
  }

  startTimer() {
    this.timerRef = setInterval(() => {
      this.time$.next(new Date());
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerRef);
  }

  getTime() {
    return this.time$.asObservable();
  }

  refreshEveryHour(callBack, obj) {
    setInterval(() => {
      callBack.call(obj);
    }, 3540000); // refreshing using 59 mins for token expires to get ID Token
  }
}
