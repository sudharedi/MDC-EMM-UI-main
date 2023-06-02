import { inject, TestBed } from '@angular/core/testing';

import { LoaderInterceptorService } from './loader-interceptor.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { SecurityService } from './security.service';
import { ToastrModule } from 'ngx-toastr';

describe('LoaderInterceptorService', () => {
  let service: LoaderInterceptorService;
  let dataService: SecurityService;
  let httpMock: HttpTestingController;
  const commonURL = 'http://ec2-54-145-54-20.compute-1.amazonaws.com:8088/proterra/controlpanel/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        }),
      ],
      providers: [
        SecurityService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoaderInterceptorService,
          multi: true,
        },
      ],
    });
    service = TestBed.inject(LoaderInterceptorService);
    dataService = TestBed.inject(SecurityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should increment requests on every http call',
    inject([HttpClient, HttpTestingController],
      (http: HttpClient, httpMocks: HttpTestingController) => {
        http.get(commonURL + 'users').subscribe(
          response => {
            expect(response).toBeTruthy();
          }
        );
        const request = httpMocks.expectOne(
          commonURL + 'users'
        );
        expect(service.requests.length).toBe(0);
      }));
});
