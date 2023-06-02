import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { cognitoLogin } from '../urlListConstants';
import * as AWS from 'aws-sdk';
import * as awsservice from 'aws-sdk/lib/service';
import * as CognitoIdentity from 'aws-sdk/clients/cognitoidentity';
import * as jwt_decode from 'jwt-decode';
import { AuthenticationDetails, CognitoUser, CognitoUserSession, CognitoUserPool, CognitoRefreshToken } from 'amazon-cognito-identity-js';
import { BaseService } from '../base-service.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor(public baseService: BaseService, private http: HttpClient) { }
  public static _REGION = environment.cognitoLogin.region;
  public static _IDENTITY_POOL_ID = environment.cognitoLogin.identityPoolId;
  public static _USER_POOL_ID = environment.cognitoLogin.userPoolId;
  public static _CLIENT_ID = environment.cognitoLogin.clientId;
  public static _VERSION = environment.cognitoLogin.version;
  public static _REDIRECT_URL = environment.cognitoLogin.proterra_url;
  public static _URL = environment.cognitoLogin.url;
  public static _HEADERS = { 'Content-Type': 'application/x-www-form-urlencoded' };
  public static _CORPORATELOGOUTURL = environment.cognitoLogin.corporate_logout_url;
  public static _CORPORATETOKENURL = environment.cognitoLogin.corporate_token_url;
  public static _TENANTURL = environment.cognitoLogin.tanent_url;

  public static _POOL_DATA: any = {
    UserPoolId: CognitoService._USER_POOL_ID,
    ClientId: CognitoService._CLIENT_ID
  };

  public static _COPORATETOKENPARAMS = {
    grant_type: 'authorization_code',
    client_id: CognitoService._CLIENT_ID,
    redirect_uri: CognitoService._REDIRECT_URL,
    code: ''
  }

  public static _COPORATEREFRESHTOKENPARAMS = {
    grant_type: 'refresh_token',
    client_id: CognitoService._CLIENT_ID,
    refresh_token: ''
  }

  public cognitoCreds: AWS.CognitoIdentityCredentials;
  setIntervalIds = [];

  getUserPool() {
    if (environment.cognitoLogin.cognito_idp_endpoint) {
      CognitoService._POOL_DATA.endpoint = environment.cognitoLogin.cognito_idp_endpoint;
    }
    return new CognitoUserPool(CognitoService._POOL_DATA);
  }

  getCurrentUser() {
    return this.getUserPool().getCurrentUser();
  }

  getIdententifiersList(param, callbacksuccess, callbackFailure, loginMe) {
    try {
      let me = this;
      AWS.config.update({
        region: CognitoService._REGION,
        apiVersions: {
          cognitoidentityserviceprovider: CognitoService._VERSION
        },
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: CognitoService._IDENTITY_POOL_ID
        })

      });
      var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
      var params = {
        UserPoolId: CognitoService._USER_POOL_ID
      };
      cognitoidentityserviceprovider.listIdentityProviders(params, function (err, data) {
        if (err) {
          callbackFailure(err, loginMe);
        } else {
          me['providersList'] = [];
          data.Providers.forEach(x => {
            me['providersList'].push(x.ProviderName);
          });
          me.validateProviderName(param, callbacksuccess, callbackFailure, loginMe);
        }
      });
    }
    catch (err) {
      console.log('catch', err);
    }
  }

  validateProviderName(providerName, callbacksuccess, callbackFailure, loginMe) {
    try {
      let me = this;
      var myConfig = new AWS.Config();
      myConfig.update({
        region: CognitoService._REGION,
        apiVersions: {
          cognitoidentityserviceprovider: CognitoService._VERSION
        },
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: CognitoService._IDENTITY_POOL_ID
        })
      });
      var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
      var params = {
        IdpIdentifier: providerName, /* required */
        UserPoolId: CognitoService._USER_POOL_ID
      };
      cognitoidentityserviceprovider.getIdentityProviderByIdentifier(params, function (err, data) {
        if (err) {
          callbackFailure(err, loginMe);
        } else {
          if (me['providersList'].indexOf(data.IdentityProvider.ProviderName) !== -1) {
            callbacksuccess(data.IdentityProvider.IdpIdentifiers[0]);
          }
        }
      });
    }
    catch (err) {
      console.log('validateProviderNameCatch', err);
    }
  }

  resetTab() {
    this.clearAllIntervalId();
  }

  clearAllIntervalId() {
    this.setIntervalIds.forEach(id => {
      clearInterval(id);
    });
  }

  clearIntervalId(id) {
    clearInterval(id);
  }

  retrieveSession(cognitoLoginSuccess, loadLogin, me) {
    var userPool = new CognitoUserPool(CognitoService._POOL_DATA);
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          loadLogin(err, me);
        }
        cognitoLoginSuccess(session, me);
      });
    } else {
      loadLogin(null, me);
    }
    return cognitoUser;
  }

  setCurrentUserObj(obj) {
    let CURRENTUSERCOOKIENAME;
    let cookiearray = document.cookie.split(';');

    // Now take key value pair out of this array
    for (var i = 0; i < cookiearray.length; i++) {
      let name = cookiearray[i].split('=')[0];
      if (name === 'CURRENTUSERCOOKIENAME') {
        CURRENTUSERCOOKIENAME = cookiearray[i].split('=')[1];
      }
    }

    if (CURRENTUSERCOOKIENAME !== undefined && CURRENTUSERCOOKIENAME === "") {
      localStorage.setItem('token', CURRENTUSERCOOKIENAME);
    }
  }

  getTenantByID(tenantId, sucessCallBack, errorCallback, me) {
    var currentTenantObj = this.getCurrentTenantObj();
    if (currentTenantObj && Object.keys(currentTenantObj).length > 0 && tenantId === currentTenantObj['orgId']) {
      if (sucessCallBack) {
        sucessCallBack(currentTenantObj, me);
      } else {
        console.log("Success call back is null for getTenantById")
      }
      return;
    }

    let headers = CognitoService._HEADERS;

    let url = CognitoService._TENANTURL + '/' + tenantId//`https://exp-api.proterra.com/exp-ams-qa/v1/tenants/${tenantId}`;


    this.http.get(url, { 'headers': headers })
      .subscribe(
        (data) => {
          sucessCallBack(data, me);
        },
        (error) => {
          errorCallback(error);
        }
      );
  }

  authenticateCoporateLoginRefreshInternal() {
    this.refreshSSOToken(function (res) {
      let data = JSON.parse(localStorage.getItem('sso_data'));
      data.id_token = res.id_token;
      data.access_token = res.access_token;
      // me.loginService.setAccessToken(data.id_token);
      //$.cookie('CURRENTUSERCOOKIENAME1', $.HTTP.$HEADER_VALUE['authorization']);
      localStorage.setItem('token', data.id_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      localStorage.setItem('sso_data', JSON.stringify(data));
    }, function (err) {
      console.log('loginfailed error', err);
      //$.Login.loginFailed();
    });
  }

  authenticateCoporateLoginRefresh() {
    this.authenticateCoporateLoginRefreshInternal();
    setInterval(function () {
      this.authenticateCoporateLoginRefreshInternal();
    }, 45 * 60 * 1000);
  }

  refreshSSOToken(sucessCallBack, errorCallback) {

    const tokenData = JSON.parse(localStorage.getItem('sso_data'));
    if(tokenData && tokenData.refresh_token) {


      const data = CognitoService._COPORATEREFRESHTOKENPARAMS;

      let headers = CognitoService._HEADERS;
      let url = CognitoService._CORPORATETOKENURL;


      const body = new URLSearchParams();
      body.set('grant_type', data.grant_type);
      body.set('client_id', data.client_id);
      body.set('refresh_token', tokenData.refresh_token);


      this.http.post(url, body.toString(), { 'headers': headers })
        .subscribe(
          (data) => {
            sucessCallBack(data);
          },
          (error) => {
            errorCallback(error);
          }
        );
    }


  };

  getCurrentTenantObj() {
    let currentTenantObj;
    var data = localStorage.getItem('token');
    // if (data) {
    //   //currentTenantObj = JSON.parse(data);
    // }
    //return currentTenantObj;
    return data;
  }

  refreshToken() {
    this.refreshTokenInternal();
    setInterval(function () {
      this.refreshTokenInternal();
    }, 45 * 60 * 1000);
  }

  refreshTokenInternal() {
    var refreshToken = new CognitoRefreshToken({
      RefreshToken : localStorage.getItem('refreshToken')
    });

    //var refreshToken =  localStorage.getItem('refreshToken');
    var userPool = new CognitoUserPool(CognitoService._POOL_DATA);
    var cognitoUser = userPool.getCurrentUser();

    cognitoUser.refreshSession(refreshToken, function (err, session) {
      if (err) {
        // todo handle error
      }
      if (session.isValid()) {
        localStorage.setItem('token', session.idToken.jwtToken);
        //scb(me);
        //var refreshToken =  localStorage.getItem('refreshToken');
        //$.HTTP.$HEADER_VALUE['authorization'] = session.idToken.jwtToken;
        //$.AWSUTIL.$currentRefreshToken = session.refreshToken.token;
      }
    });
  }


  // AWS Stores Credentials in many ways, and with TypeScript this means that
  // getting the base credentials we authenticated with from the AWS globals gets really murky,
  // having to get around both class extension and unions. Therefore, we're going to give
  // developers direct access to the raw, unadulterated CognitoIdentityCredentials
  // object at all times.
  setCognitoCreds(creds: AWS.CognitoIdentityCredentials) {
    this.cognitoCreds = creds;
  }

  buildCognitoCreds(idTokenJwt: string) {
    let url = 'cognito-idp.' + CognitoService._REGION.toLowerCase() + '.amazonaws.com/' + CognitoService._USER_POOL_ID;
    if (environment.cognitoLogin.cognito_idp_endpoint) {
      url = environment.cognitoLogin.cognito_idp_endpoint + '/' + CognitoService._USER_POOL_ID;
    }
    const logins: CognitoIdentity.LoginsMap = {};
    logins[url] = idTokenJwt;
    const params = {
      IdentityPoolId: CognitoService._IDENTITY_POOL_ID, /* required */
      Logins: logins
    };
    const serviceConfigs = <awsservice.ServiceConfigurationOptions>{};
    if (environment.cognitoLogin.cognito_identity_endpoint) {
      serviceConfigs.endpoint = environment.cognitoLogin.cognito_identity_endpoint;
    }
    const creds = new AWS.CognitoIdentityCredentials(params, serviceConfigs);
    this.setCognitoCreds(creds);
    return creds;
  }


  _changePasswordAndLogin(username, password, newPassword, scb, me, ecb) {
    username = username.toLowerCase();
    var authenticationData = {
      Username: username,
      Password: password
    };
    var authenticationDetails = new AuthenticationDetails(authenticationData);
    var userPool = new CognitoUserPool(CognitoService._POOL_DATA);
    var userData = {
      Username: username,
      Pool: userPool
    };
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      newPasswordRequired: function (userAttributes, requiredAttributes) {
        var attributesData = {};
        // Do not remove following code.
        // attributesData['zoneinfo']='124';
        // attributesData['custom:roleInformation']='';
        // var newPassword = prompt('Please enter new password' ,'');
        cognitoUser.completeNewPasswordChallenge(newPassword, attributesData, this);
      },
      onSuccess: function (result) {
        scb(result, me);
      },
      onFailure: function (err) {
        ecb(err, me);
      }
    });
  }



  getTokenAfterExpiredAndRefresh() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      fetch(environment.cognitoLogin.cognito_idp_endpoint, {
        headers: {
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
          'Content-Type': 'application/x-amz-json-1.1',
        },
        mode: 'cors',
        cache: 'no-cache',
        method: 'POST',
        body: JSON.stringify({
          ClientId: environment.cognitoLogin.clientId,
          AuthFlow: 'REFRESH_TOKEN_AUTH',
          AuthParameters: {
            REFRESH_TOKEN: refreshToken,
          }
        }),
      }).then((res) => {
        return res.json(); // this will give jwt id and access tokens
      }).then(data => {
        if (data && data.AuthenticationResult.IdToken) {
          const IdToken = data.AuthenticationResult.IdToken;
          localStorage.setItem('token', IdToken);
          // this.timerService.refreshAPIs();
        }
      });
    }
  }

  checkTokenExpiryAndGetToken() {
    const EXISTEDTOKEN = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    if (EXISTEDTOKEN === '') { return; }
    try {
      const decodedToken = jwt_decode(EXISTEDTOKEN);
      const currentDT = new Date();
      const date = new Date(0);
      currentDT.setMinutes(currentDT.getMinutes() - 5);
      if (decodedToken.exp !== undefined) {
        const tokenExpdate = date.setUTCSeconds(decodedToken.exp);
        if (tokenExpdate.valueOf() < currentDT.valueOf()) {
          this.getIdTokenByRefreshToken();
        }
      }
    } catch (error) {
      console.log(error);
    }
    return localStorage.getItem('token');
  }

  getUserAttributes(sc, ec, jwtToken, me) {
    var userPool = new CognitoUserPool(CognitoService._POOL_DATA);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          ec(err);
        }
        if (session.isValid()) {
          cognitoUser.getUserAttributes(function (err, result) {
            if (err) {
              ec(err);
              return;
            }
            sc(result, jwtToken, me);
          });
        }
      });
    } else {
      ec(null);
    }
  }

  getIdTokenByRefreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      fetch(environment.cognitoLogin.cognito_idp_endpoint, {
        headers: {
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
          'Content-Type': 'application/x-amz-json-1.1',
        },
        mode: 'cors',
        cache: 'no-cache',
        method: 'POST',
        body: JSON.stringify({
          ClientId: environment.cognitoLogin.clientId,
          AuthFlow: 'REFRESH_TOKEN_AUTH',
          AuthParameters: {
            REFRESH_TOKEN: refreshToken,
          }
        }),
      }).then((res) => {
        return res.json(); // this will give jwt id and access tokens
      }).then(data => {
        if (data && data.AuthenticationResult.IdToken) {
          const IdToken = data.AuthenticationResult.IdToken;
          localStorage.setItem('token', IdToken);
        }
      });
    }
  }

  LoginAuthGetToken(code, sucessCallBack, errorCallback, me) {

    const data = CognitoService._COPORATETOKENPARAMS;
    data.code = code;
    let url = CognitoService._CORPORATETOKENURL;
    let headers = CognitoService._HEADERS;

    const body = new URLSearchParams();
    body.set('grant_type', data.grant_type);
    body.set('client_id', data.client_id);
    body.set('redirect_uri', data.redirect_uri);
    body.set('code', data.code);
    this.http.post(url, body.toString(), { 'headers': headers })
      .subscribe(
        (data) => {
          sucessCallBack(data, me);
        },
        (error) => {
          errorCallback(error, me);
        }
      );
  }

  coporatelogout() {
    var url = CognitoService._CORPORATELOGOUTURL + "?client_id=" + CognitoService._CLIENT_ID + "&logout_uri=" + CognitoService._REDIRECT_URL;
    window.location.href = url;
  }
}

export interface CognitoCallback {
  cognitoCallback(message: string, result: any): void;

  handleMFAStep?(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void;
}

export interface LoggedInCallback {
  isLoggedIn(message: string, loggedIn: boolean): void;
}

export interface ChallengeParameters {
  CODE_DELIVERY_DELIVERY_MEDIUM: string;

  CODE_DELIVERY_DESTINATION: string;
}
