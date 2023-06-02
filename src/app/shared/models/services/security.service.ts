import { Injectable } from '@angular/core';
import { BaseService } from '../../../base-service.service';
import { Observable } from 'rxjs';

import { urlList } from '../../../urlListConstants';
import { CertificateResponse } from '../certificate.model';


@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private baseService: BaseService) { }

  fectAll(params?): Observable<CertificateResponse> {
    return this.baseService.get(urlList.GET_CERTIFICATE_LIST);
  }

  getCertificateDetailsById(id): Observable<any> {
    return this.baseService.get(urlList.GET_CERTIFICATE_LIST + '/' + id);
  }

  updateCertificate(certificateId, deviceSerial) {
   return this.baseService.patch(`/devices/${deviceSerial}/certificate/${certificateId}` , '');
  }

  revokeCertificate(certificateId) {
    return this.baseService.put(`/certificates/${certificateId}`, '');
  }

  deletePendingCertficate(deviceSerial, jobId) {
    return this.baseService.delete(`/devices/${deviceSerial}/certificate/pending/${jobId}`);
  }

}
