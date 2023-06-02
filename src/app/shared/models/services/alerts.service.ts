import { Injectable } from '@angular/core';
import { BaseService } from '../../../base-service.service';
import { Observable } from 'rxjs';

import { urlList } from '../../../urlListConstants';


@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(private baseService: BaseService) { }

  fectAll(params?): Observable<any> {
    return this.baseService.get(urlList.GET_ALERTS_LIST);
  }

  clearNotifications() {
    return this.baseService.delete(urlList.GET_ALERTS_LIST);
  }

}
