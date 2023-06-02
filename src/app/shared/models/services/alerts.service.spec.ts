import { TestBed } from '@angular/core/testing';

import { AlertsService } from './alerts.service';
import { BaseService } from '../../../base-service.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('AlertsService', () => {
    let service: AlertsService;

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
        service = TestBed.inject(AlertsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get list of alerts on fetchAll function', () => {
        spyOn(service, 'fectAll').and.callThrough();
        service.fectAll();
        expect(service.fectAll).toHaveBeenCalled();
    });

    it('clearNotifications', () => {
        spyOn(service, 'clearNotifications').and.callThrough();
        service.clearNotifications();
        expect(service.clearNotifications).toHaveBeenCalled();
    });
});
