import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../login/login.service';
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const currentToken = this.loginService.getAccessToken();

    if (request.body && typeof(request.body) === 'string' && request.body.indexOf('refresh_token') >= 1) {
      //do nothing
    }
    else if (currentToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `${currentToken}`,
          'Content-Type': 'application/json'
        }
      });
    }
    return next.handle(request);
  }
}
