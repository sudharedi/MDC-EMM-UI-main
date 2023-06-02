import { environment } from '../environments/environment';
export const urlList = {
  BASEURL: environment.API_URL,
  GET_DEVICE_LIST : '/devices',
  GET_DEVICE_LIST_BYID: '/devices/{deviceId}',
  GET_DEVICE_GROUPS: '/groups',
  UPDATE_DEVICEID: '/devices/{deviceId}',
  GET_CERTIFICATE_LIST: '/certificates/unassigned',
  GET_AUDITLOGS_LIST: '/audit',
  CREATE_GROUP: '/groups',
  GET_GROUPS_NAMES: '/groups/list',
  GET_APP_PACKAGE_LIST: '/softwarepackages/available',
  GET_ALERTS_LIST: '/eventlogs',
  GET_DEVICE_LIST_UNASSIGNED: '/devices/unassigned',
  GET_UPDATE_HISTORY_LIST: 'assets/data/updateHistoryList.json',
  GET_CONFIG_HISTORY_LIST: 'assets/data/updateHistoryList.json',
  GET_FIRMWARE_List: '/firmwares/available',
  UPDATE_CONFIG: '/devices/configurations',
  GET_DEFAULT_CONFIGS: '/devices/configurations',
  GET_FIRMWARE_HISTORY_LIST: 'assets/data/firmwareUpdateHistoryList.json',
  UPDATE_SOFTWARE_PACKAGE_FOR_DEVICE: '/devices/softwarepackage',
  UPDATE_FIRMWARE_FOR_DEVICE: '/devices/firmware',
  GET_METRICS: '/dashboard/metrics',
  DELETE_MULTIPLE_GROUPS: '/groups'
};

export const cognitoLogin = {
    // login setup
    // region: 'us-east-1',
    // //identityPoolId: 'us-east-1:1ade09fd-7e5c-4b8e-b3bd-78b5a9cf4193',
    // identityPoolId: 'us-east-1:270f46ad-6b8f-4213-9392-1a11d6f5755b',
    // // userPoolId: 'us-east-1_YzMtrvVo6',
    // userPoolId: 'us-east-1_TNryPv9dQ',
    // // clientId: 'l6mad81k379is71lja1sbg7nd',
    // clientId: 'glvhg0hqhqqbdfuarvfsug4rt',
    // cognito_idp_endpoint: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_TNryPv9dQ',
    // cognito_identity_endpoint: '',
    // sts_endpoint: '',
    // url: 'https://proterra-exp-dev.auth.us-east-1.amazoncognito.com/authorize?',
    // //proterra_url: 'https://exp-dev.proterra.com',
    // proterra_url: 'http://localhost:9000',
    // // proterra_url: 'https://dev-mdc.proterra.com',
    // version: '2016-04-18',
    // corporate_logout_url: 'https://proterra-exp-dev.auth.us-east-1.amazoncognito.com/logout'
};
// Don't remove this code, for running with local josns added this code

// export const urlList = {
//   BASEURL: '',
//   GET_DEVICE_LIST : 'assets/data/AllDevices.json',
//   GET_DEVICE_LIST_BYID: 'assets/data/DeviceByID.json',
//   GET_DEVICE_GROUPS: 'assets/data/groupList.json',
//   UPDATE_DEVICEID: '/devices/{deviceId}',
//   GET_CERTIFICATE_LIST: 'assets/data/allCertificates.json',
//   GET_AUDITLOGS_LIST: 'assets/data/auditLogsList.json',
//   CREATE_GROUP: '/groups',
//   GET_GROUPS_NAMES: '/groups/list',
//   GET_APP_PACKAGE_LIST:'assets/data/AllAppPackages.json',
//   GET_ALERTS_LIST:'assets/data/alertsNotifications.json',
//   GET_DEVICE_LIST_UNASSIGNED: '/devices/unassigned',
//   GET_UPDATE_HISTORY_LIST: 'assets/data/updateHistoryList.json',
//   GET_CONFIG_HISTORY_LIST: 'assets/data/updateHistoryList.json',
//   GET_FIRMWARE_List:'assets/data/firmwareList.json',
//   UPDATE_CONFIG: '/devices/configurations',
//   GET_DEFAULT_CONFIGS: '/devices/configurations',
//   GET_FIRMWARE_HISTORY_LIST: 'assets/data/firmwareUpdateHistoryList.json',
//   UPDATE_SOFTWARE_PACKAGE_FOR_DEVICE: '/devices/softwarepackage'
// };
