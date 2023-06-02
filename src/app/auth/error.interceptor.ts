import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CognitoService } from 'src/app/auth/cognito.service';
import { tap, catchError, finalize, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    public cognitoService: CognitoService,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown> | HttpResponse<any>> {
    return next.handle(request).pipe(map((event: any) => {
      if (event instanceof HttpResponse) {

      }
      return event;
    })).pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status == 404 && err.error == "Preference Not found"){
          // return;
          return throwError('no toast message');
        }
        if (err.status === 401 || err.status === 400 || err.status === 403) {
          this.authService.logout();
          this.loginService.logout();
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
          this.toastrService.error('Problem occurred login to continue', '', {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          });
          return throwError(err);
        } else {
          const error = err.error && err.error.message ? err.error.message : 'Internal server error';
          // const ERROROBJ: IToastMessage = { type: TOASTMESSAGE_TYPE.ERROR, message: error};
          // this.snackBar.openFromComponent(ToastAlertComponent, TOAST_CONFIG_PAYLOAD.get(ERROROBJ));
          return throwError(error);
        }
      }));
  }
}
