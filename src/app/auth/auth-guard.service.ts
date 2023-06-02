import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DeviceService } from '../devices/device.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toastrService: ToastrService,
    private deviceService: DeviceService
    ) { }
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const userdata = this.loginService.getAccessToken();
      if (userdata) {
        return true;
      } else {
        this.router.navigate(['']);
        // this.toastrService.error('Login to continue', '', {
        //   timeOut: 3000,
        //   positionClass: 'toast-top-center',
        // });
      }
    }
}
