import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';


import { BaseService } from './base-service.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('BaseServiceService', () => {
  let service: BaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot({
          preventDuplicates: true
        }),
      ],
      providers: [
        BaseService
      ]
    });
    service = TestBed.inject(BaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http get method one time', () => {
    spyOn(service, 'post').and.callThrough();
    service.post('url', 'data');
    expect(service.post).toHaveBeenCalled();
  });

  it('should call http post method one time', () => {
    spyOn(service, 'get').and.callThrough();
    service.get('url');
    expect(service.get).toHaveBeenCalled();
  });

  it('should call getUser method one time', () => {
    spyOn(service, 'getUser').and.callThrough();
    service.getUser('url');
    expect(service.getUser).toHaveBeenCalled();
  });

  it('should call http update method one time', () => {
    spyOn(service, 'update').and.callThrough();
    service.update('url', 'id', 'data');
    expect(service.update).toHaveBeenCalled();
  });

  it('should call http patch method one time', () => {
    spyOn(service, 'patch').and.callThrough();
    service.patch('url', 'data');
    expect(service.patch).toHaveBeenCalled();
  });

  it('should call http put method one time', () => {
    spyOn(service, 'put').and.callThrough();
    service.put('url', 'data');
    expect(service.put).toHaveBeenCalled();
  });

  it('should call http delete method one time', () => {
    spyOn(service, 'delete').and.callThrough();
    service.delete('url', 'data');
    expect(service.delete).toHaveBeenCalled();
  });

  it('errorHandler - if branch', () => {
    spyOn(service, 'errorHandler').and.callThrough();
    service.errorHandler('server error');
    expect(service.errorHandler).toHaveBeenCalled();
  });

  it('errorHandler - else branch', () => {
    const serverError = {
      error: {
        error:
        {
          message: 'server error'
        }
      }
    };
    spyOn(service, 'errorHandler').and.callThrough();
    service.errorHandler(serverError);
    expect(service.errorHandler).toHaveBeenCalled();
  });
});
