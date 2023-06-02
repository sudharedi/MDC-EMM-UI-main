import { TestBed } from '@angular/core/testing';

import { AuditLogsService } from './auditLogs.service';
import { BaseService } from '../../../base-service.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('AuditLogsService', () => {
    let service: AuditLogsService;

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
        service = TestBed.inject(AuditLogsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get list of sudit logs on fetchAll function', () => {
        spyOn(service, 'fectAll').and.callThrough();
        service.fectAll();
        expect(service.fectAll).toHaveBeenCalled();
    });
});
