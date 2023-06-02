// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  API_URL: 'https://exp-api.proterra.com/exp-mdc-device-qa/api/v1/mdcservice/core',

  cognitoLogin: {

  		base_url: "https://exp-api.proterra.com/exp-ams-qa-launch2020",
	    region: 'us-east-1',
	    identityPoolId: 'us-east-1:4a087b19-50ec-42b4-a73f-602159e88452',
	    userPoolId: 'us-east-1_YLu50ozIk',
	    clientId: '2gd9l6cvgta6los4m7mheom0u7',
	    cognito_idp_endpoint: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_YLu50ozIk',
	    cognito_identity_endpoint: '',
	    sts_endpoint: '',
	    url: 'https://proterra-launch2020-qa.auth.us-east-1.amazoncognito.com/authorize?',
	    proterra_url: 'https://qa-mdc.proterra.com',
	    version: '2016-04-18',
	    tabs_url: "https://exp-api.proterra.com/exp-ams-qa-launch2020/ams/v1/ui/tabs",
	    tanent_url: "https://exp-api.proterra.com/exp-ams-qa-launch2020/v1/tenants",
	    corporate_token_url: 'https://proterra-launch2020-qa.auth.us-east-1.amazoncognito.com/oauth2/token',
	    corporate_logout_url: 'https://proterra-launch2020-qa.auth.us-east-1.amazoncognito.com/logout'
	}
};
