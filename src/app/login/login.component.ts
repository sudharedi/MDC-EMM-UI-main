import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from './login.service';
import { AuthService } from 'src/app/auth/auth.service';
import { CognitoService } from '../auth/cognito.service';
import { distinctUntilChanged, map, debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DeviceService } from '../devices/device.service';
import { cognitoLogin } from '../urlListConstants';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = {
    username: '',
    password: '',
    rememberMe: false
  };
  users;
  userNames: Array<any> = [];
  public loginErrorMessage: any;
  errorMessage: string;
  successMessage: string;
  coporateUsername;
  coporateStorageKey = 'sso_data';
  tenantId;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService,
    private currentRoute: ActivatedRoute,
    private deviceService: DeviceService,
    private cognitoService: CognitoService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.cognitoService.resetTab();
    var data = localStorage.getItem('sso_data');
    if (data != null) {
      this.retrieveSSoSession(this);
      return;
    }
    this.cognitoService.retrieveSession(this.cognitoLoginSuccess, this.loadLogin, this);
    const params = this.getUrlVars();
    if (params['code'] !== undefined && params['code'] !== '') {
      this.cognitoService.LoginAuthGetToken(params['code'], this.CreateUser, this.loadLogin, this);
    }
  }

  navigateToDashboard() {
    this.cognitoService._changePasswordAndLogin(this.loginForm.username, this.loginForm.password, null, this.cognitoLoginSuccess, this, this.cognitoLoginFailed)
  }

  cognitoLoginSuccess(data, me) {
    try {
      if (data == null || !data.isValid()) {
        // $.Login.loadLogin();
        return;
      }
      if (me.performanceLogin()) {
        return;
      }
      let jwtToken = data.idToken.jwtToken;
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('refreshToken', data.refreshToken.token);

      // $.HTTP.$HEADER_VALUE['authorization'] = data.idToken.jwtToken;
      // $.cookie('CURRENTUSERCOOKIENAME1', $.HTTP.$HEADER_VALUE['authorization']);
      // $.AWSUTIL.$currentRefreshToken = data.refreshToken.token;
      me.cognitoService.getUserAttributes(me.success, me.cognitoLoginFailed, jwtToken, me);

    } catch (e) {
      console.log("Internal error please contact administrator");
    }
  }

  cognitoLoginFailed(err, me) {
    let errMsg = "";
    try {
      errMsg = err.message;
    } catch (e) {
      errMsg = "Invalid username or password";
    }

    me.toastrService.error(errMsg, '', {
      timeOut: 5000,
      positionClass: 'toast-top-center',
    });
  }

  success(attributes, jwtToken, me) {
    var data = {};
    for (var i = 0; i < attributes.length; i++) {
      var name = attributes[i].getName();
      if (name.startsWith("custom:")) {
        name = name.substring(7)
      }
      data[name] = attributes[i].getValue()
    }
    data['tenantId'] = data['tenantId'];
    me.tenantId = data['tenantId'];
    const userObj = JSON.parse(atob(jwtToken.split('.')[1]));
    data['assignedRole'] = userObj["custom:assignedRole"];
    //me.cognitoService.setCurrentUserObj(data);
    if (data['tenantId']) {

      me.toastrService.error('You are not authorize to login', '', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
      });

      //me.cognitoService.getTenantByID(data['tenantId'], me.getTenantByIDSuccess, me.getTenantByIDError,me);
      //me.cognitoService.refreshToken();
    } else {
      me.cognitoService.refreshToken();
      me.deviceService.getCurrentUser().subscribe(data => {
        localStorage.setItem('tenantId', data.tenantId);
        if(data.tenantId === null) {
          me.getRoles();
        }
        //me.getRoles();
        // this.router.navigate(['devices']);
      },
        err => {
          // should handle error from getCurrentUser
        });
    }
  }

  // refreshTokenSuccess(me) {
  //   me.cognitoService.getTenantByID(me.tenantId, me.getTenantByIDSuccess, me.getTenantByIDError,me);
  // }


  getTenantByIDSuccess(tenantData, me) {
    if (tenantData) {
      //this.cognitoService.setCurrentTenantObj(tenantData);
      //$.Home.init();
      me.deviceService.getCurrentUser().subscribe(data => {
        localStorage.setItem('tenantId', data.tenantId);
        me.getRoles();
        // this.router.navigate(['devices']);
      },
        err => {
          // should handle error from getCurrentUser
        });
      //me.cognitoService.refreshToken();
    } else {
      me.cognitoService.refreshToken();
    }
  }

  getTenantByIDError(error) {
    // should handle error
  }

  onselect(e) {
    const find = this.users.find((user) => {
      return user.username === e.item;
    });
    this.loginForm = find ? Object.assign({}, find) : { username: '', password: '', rememberMe: false };
  }


  cognitoCallback(message: string, result: any) {
    if (this.loginForm.rememberMe === true) {
      const users = JSON.parse(localStorage.getItem('rememberedUsers') || '[]');
      const findUser = users.findIndex((user) => {
        return user.username === this.loginForm.username;
      });

      if (findUser < 0) {
        users.push(this.loginForm);
      } else if (findUser >= 0) {
        users[findUser] = this.loginForm;
      }
      localStorage.setItem('rememberedUsers', JSON.stringify(users));
    }
    if (message !== null) { // error
      this.errorMessage = message;
    } else { // success
      const idToken = result.idToken.jwtToken;
      const refreshToken = result.refreshToken.token;
      this.loginService.setAccessToken(idToken);
      this.loginService.setRefreshToken(refreshToken);
      this.loginService.setLoggedInUserDetails(result.idToken.payload);
    }
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.router.navigate(['/devices']);
      // for token expired
      // this.headerService.loadGarages();
      // this.router.navigate(['runTrackAssign']);
    }
  }

  getRoles() {
    this.deviceService.getRole().subscribe(data => {
      let me = this;
      const mdc_tabs = data.tabs[0];
      if(mdc_tabs.hasOwnProperty('MDCPortal')) {
        localStorage.setItem('userRoles', JSON.stringify(mdc_tabs.MDCPortal[0]));
        me.router.navigate(['devices']);
      }
      else {
        me.toastrService.error('You are not authorize to login', '', {
          timeOut: 5000,
          positionClass: 'toast-top-center',
        });
      }
    },
      err => {
        this.router.navigate(['devices']);
      });
  }

  coporatelogin(coporateUsername) {
    this.authService.isAuthenticated(coporateUsername.split('@')[1], this.providerValidationSuccess, this.providerValidationFailure, this);
  }

  providerValidationSuccess(data) {
    const url = environment.cognitoLogin.url + "idp_identifier=" + data
      + "&redirect_uri=" + environment.cognitoLogin.proterra_url
      + "&response_type=" + 'code'
      + "&client_id=" + environment.cognitoLogin.clientId
      + "&scope=" + 'email+openid';

    window.location.href = url;
  }

  providerValidationFailure(error, me) {
    me.toastrService.error('Invalid credentials', '', {
      timeOut: 5000,
      positionClass: 'toast-top-center',
    });
  }

  retrieveSSoSession(me) {
    var data = localStorage.getItem('sso_data');
    if (data) {
      try {
        this.authenticateCoporateLogin(JSON.parse(data), me)
      } catch (e) {
        console.debug(e);
      }

    }
  }

  getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  loadLogin(event, me) {
    // this.router.navigate(['/']);
    me.performanceLogin();
  }

  performanceLogin() {
    try {
      let hash = location.hash.substr(13);
      hash = hash.split("?")[0]
      if (hash && 'performanceLogin' == hash) {
        let CURRENTUSERCOOKIENAME;
        let cookiearray = document.cookie.split(';');

        // Now take key value pair out of this array
        for (var i = 0; i < cookiearray.length; i++) {

          let name = cookiearray[i].split('=')[0];
          if (name === 'CURRENTUSERCOOKIENAME1') {
            CURRENTUSERCOOKIENAME = cookiearray[i].split('=')[1];
          }

        }
        localStorage.setItem('token', CURRENTUSERCOOKIENAME);
        var userAttributeMap = {}
        var attributes = this.authService.parseToken(CURRENTUSERCOOKIENAME);
        attributes.forEach((key, value) => {
          if (key.startsWith("custom:")) {
            var val = key.split(":")[1]
            userAttributeMap[val] = value
          } else {
            userAttributeMap[key] = value
          }
        });
        return true;
      }
      return false;
    } catch (err) {
      console.log(err)
      return false;
    }
  }


  CreateUser(data, me) {

    if (data && data.id_token && data.refresh_token) {

      me.loginService.setAccessToken(data.id_token);
      let CURRENTUSERCOOKIENAME1;
      let cookiearray = document.cookie.split(';');

      // Now take key value pair out of this array
      for (var i = 0; i < cookiearray.length; i++) {

        let name = cookiearray[i].split('=')[0];
        if (name === 'CURRENTUSERCOOKIENAME1') {
          CURRENTUSERCOOKIENAME1 = cookiearray[i].split('=')[1];
        }

      }

      if (CURRENTUSERCOOKIENAME1 !== undefined && CURRENTUSERCOOKIENAME1 === "") {

        localStorage.setItem('token', CURRENTUSERCOOKIENAME1);
      }
    }

    var details = JSON.parse(atob(data.id_token.split('.')[1]));
    var json = {
      firstName: details["custom:firstName"],
      lastName: details["custom:lastName"],
      roleInformation: details["custom:roleInformation"],
      userName: details.email,
      cognitoPoolSubId: details["sub"],
      address: {
        // addressLine1: details["custom:addressLine1"],
      },
      // phone: details["custom:phone"],
      email: details.email
    }
    var tenantId = details["custom:tenantId"]
    if (tenantId) {
      // json.userName = details["cognito:username"];
      // me.authService.createSSOUser(tenantId, json);
    }
    else {
      me.authService.createSSOInternalUser(json);
    }
    me.authenticateCoporateLogin(data, me);
  }

  authenticateCoporateLogin(data, me) {

    if (data && data.id_token && data.refresh_token) {

      this.loginService.setAccessToken(data.id_token);
      localStorage.setItem('refreshToken', data.refresh_token);

      //if (typeof (Storage !== "undefined")) {
      localStorage.setItem(this.coporateStorageKey, JSON.stringify(data));
      if (window.location.href.includes('?')) {
        window.history.pushState(null, document.title, location.href.substring(0, window.location.href.indexOf('?')))
      }

      // }
      var details = {};
      details = JSON.parse(atob(data.id_token.split('.')[1]));
      var user = {
        addressId: details["custom:addressId"],
        // addressLine1: details["custom:addressLine1"],
        createdTime: details['iat'],
        email: details['email'],
        email_verified: details['email_verified'],
        firstName: details["custom:firstName"],
        internalUser: details["custom:internalUser"],
        lastName: details["custom:lastName"],
        roleInformation: details["custom:roleInformation"],
        assignedRole: details["custom:assignedRole"],
        sub: details['sub'],
        tenantId: details["custom:tenantId"],
        userId: details['identities'][0].userId,
        userName: details["cognito:username"],
        userRole: details["custom:userRole"],
      }

      this.loginService.setAccessToken(data.id_token);
      this.loginService.setRefreshToken(data.refresh_token);
      this.loginService.setLoggedInUserDetails(details);

      if(user.tenantId) {
        me.toastrService.error('You are not authorize to login', '', {
          timeOut: 5000,
          positionClass: 'toast-top-center',
        });
        // me.cognitoService.getTenantByID(data['tenantId'], me.getTenantByIDSuccess, me.getTenantByIDError,me);
        // me.cognitoService.authenticateCoporateLoginRefresh(me);
      } else {
        me.cognitoService.authenticateCoporateLoginRefresh(me);
        // this.getRoles();
        this.deviceService.getCurrentUser().subscribe(data => {
          this.getRoles();
        },
          err => {
            // should handle error from getCurrentUser
            console.log(err);
          });
          
      }
    } else {
      let errMsg = "";
      try {
         var message = JSON.parse(data.responseText).errorMsg;
        if (!message) {
          errMsg = JSON.parse(data.responseText).msg;
        }
      } catch (e) {
        errMsg = "Invalid username or password";
      }

      me.toastrService.error(errMsg, '', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
      });
    }
  }
}
