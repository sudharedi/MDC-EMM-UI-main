import { Injectable, ErrorHandler } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { urlList } from './urlListConstants';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  //private tenantId = localStorage.getItem('tenantId');
  //private baseUrl = urlList.BASEURL + `/tenants/${this.tenantId}`;
  private baseUrl = urlList.BASEURL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  post(url, data): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + url, JSON.stringify(data), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  get(url): Observable<any> {
    this.baseUrl = urlList.BASEURL;
    return this.http.get<any>(this.baseUrl + url).pipe(catchError(this.errorHandler));
  }

  downloadCSV(url): Observable<any> {
    this.baseUrl = urlList.BASEURL;
    return this.http.get(this.baseUrl + url, {responseType: 'text'}).pipe(catchError(this.errorHandler));
  }

  getUser(url): Observable<any> {
    return this.http.get<any>(url).pipe(catchError(this.errorHandler));
  }

  update(url, id, data): Observable<any> {
    return this.http
      .put<any>(this.baseUrl + url + id, JSON.stringify(data), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  patch(url, data): Observable<any> {
    return this.http
      .patch<any>(this.baseUrl + url, JSON.stringify(data), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  put(url, data): Observable<any> {
    return this.http
      .put<any>(this.baseUrl + url, JSON.stringify(data), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  delete(url, data?) {
    const header: HttpHeaders = new HttpHeaders()
      .append('Content-Type', 'application/json; charset=UTF-8');
    const httpOptions = {
      headers: header,
      body: data
    };

    return this.http.delete<any>(this.baseUrl + url, httpOptions)
    .pipe(catchError(this.errorHandler));
  }
  errorHandler = (error) => {
    let errorMessage = '';
    if (typeof error === 'string') {
      if(error === 'no toast message'){
        // suppress the message.
        errorMessage = 'New user';
      } else {
        errorMessage = error ? error : 'server error';
        this.toastrService.error(errorMessage ? errorMessage : 'server error', '', {
          timeOut: 3000,
          positionClass: 'toast-top-center',
        });
      }
    } else {
      // Get server-side error
      errorMessage = `${error.error.message}`;
      this.toastrService.error(errorMessage ? errorMessage : 'server error', '', {
        timeOut: 3000,
        positionClass: 'toast-top-center',
      });
    }
    return throwError(errorMessage);
  }
}
