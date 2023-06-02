import { Injectable } from '@angular/core';
import { CognitoCallback, CognitoService, LoggedInCallback } from './cognito.service';
import { AuthenticationDetails, CognitoUser, CognitoUserSession, CognitoUserPool } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';
import * as STS from 'aws-sdk/clients/sts';
import { environment } from '../../environments/environment';
import { cognitoLogin } from '../urlListConstants';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public cognitoUtil: CognitoService, private router: Router, private http: HttpClient,
    private loginService: LoginService) { }

  private onLoginSuccess = (callback: CognitoCallback, session: CognitoUserSession) => {
    AWS.config.credentials = this.cognitoUtil.buildCognitoCreds(session.getIdToken().getJwtToken());

    // So, when CognitoIdentity authenticates a user, it doesn't actually hand us the IdentityID,
    // used by many of our other handlers. This is handled by some sly underhanded calls to AWS Cognito
    // API's by the SDK itself, automatically when the first AWS SDK request is made that requires our
    // security credentials. The identity is then injected directly into the credentials object.
    // If the first SDK call we make wants to use our IdentityID, we have a
    // chicken and egg problem on our hands. We resolve this problem by "priming" the AWS SDK by calling a
    // very innocuous API call that forces this behavior.
    const clientParams: any = {};
    if (environment.cognitoLogin.sts_endpoint) {
      clientParams.endpoint = environment.cognitoLogin.sts_endpoint;
    }
    const sts = new STS(clientParams);
    sts.getCallerIdentity((err, data) => {
      callback.cognitoCallback(null, session);
    });
  }

  private onLoginError = (callback: CognitoCallback, err) => {
    callback.cognitoCallback(err.message, null);
  }

  isAuthenticated(email, callbackSucess, callbackFailure, loginMe) {
    this.cognitoUtil.getIdententifiersList(email, callbackSucess, callbackFailure, loginMe);
  }

  logout() {
    if (this.cognitoUtil.getCurrentUser()) {
      this.cognitoUtil.getCurrentUser().signOut();
    }
    this.router.navigate(['/login'], {
      skipLocationChange: false,
    });
  }

  parseToken(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  createSSOUser(tenantId, data) {
    data.email = data.email.toLowerCase();
    data.userName = data.userName.toLowerCase();
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    let url = `${environment.cognitoLogin.base_url}/ams/v1/tenants/${tenantId}/tenantusers/ssoUser`;


    this.http.post(url, data, { 'headers': headers })
      .subscribe(
        (data) => {
          return data;
        },
        (error) => {
          return error;
        }
      );
  }

  createSSOInternalUser(data) {
    data.email = data.email.toLowerCase();
    data.userName = data.userName.toLowerCase();
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };


    let url = `${environment.cognitoLogin.base_url}/ssointernalusers`;



    this.http.post(url, data, { 'headers': headers })
      .subscribe(
        (data) => {
          console.log("createSSOInternalUser ",data);
          // return data;
        },
        (error) => {
          console.log("createSSOInternalUser ",error);
          // return error;
        }
      );
  }
}
