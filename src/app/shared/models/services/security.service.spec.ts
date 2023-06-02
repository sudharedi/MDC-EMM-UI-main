import { TestBed } from '@angular/core/testing';

import { SecurityService } from './security.service';
import { BaseService } from '../../../base-service.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('LoaderService', () => {
    let service: SecurityService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                ToastrModule.forRoot({
                    preventDuplicates: true
                })
            ],
            providers: [BaseService]
        });
        service = TestBed.inject(SecurityService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get all certificates', () => {
        spyOn(service, 'fectAll').and.callThrough();
        service.fectAll();
        expect(service.fectAll).toHaveBeenCalled();
    });

    it('getCertificateDetailsById should return certificate by id', () => {
        spyOn(service, 'getCertificateDetailsById').and.callThrough();
        service.getCertificateDetailsById('sampleId');
        expect(service.getCertificateDetailsById).toHaveBeenCalled();
    });

    it('updateCertificate', () => {
        spyOn(service, 'updateCertificate').and.callThrough();
        service.updateCertificate('sampleId', 'sampleSerial');
        expect(service.updateCertificate).toHaveBeenCalled();
    });

    it('revokeCertificate should call revoke certificate', () => {
        spyOn(service, 'revokeCertificate').and.callThrough();
        service.revokeCertificate('certificateId');
        expect(service.revokeCertificate).toHaveBeenCalled();
    });

    it('deletePendingCertficate should call delete certificate', () => {
        spyOn(service, 'deletePendingCertficate').and.callThrough();
        service.deletePendingCertficate('deviceSerial', 'jobId');
        expect(service.deletePendingCertficate).toHaveBeenCalled();
    });
});
