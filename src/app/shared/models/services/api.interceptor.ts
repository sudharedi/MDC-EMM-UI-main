import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../../../login/login.service';
import { AuthService } from '../../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private router: Router, private loginService: LoginService, private authService: AuthService, private toastrService: ToastrService,) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && (event?.body?.code === 403 || event?.body?.code === 401 || event?.body?.code === 400)) {
          this.authService.logout();
          this.loginService.logout();
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
          this.toastrService.error('Problem occurred login to continue', '', {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          });
        }
      })
    );
  }
}
