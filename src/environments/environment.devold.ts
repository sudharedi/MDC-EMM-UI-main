// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: 'https://exp-api.proterra.com/exp-mdc-device-dev/api/v1/mdcservice/core',

  cognitoLogin: {
  		base_url: "https://exp-api.proterra.com/exp-ams-dev",
	    region: 'us-east-1',
	    identityPoolId: 'us-east-1:270f46ad-6b8f-4213-9392-1a11d6f5755b',
	    userPoolId: 'us-east-1_TNryPv9dQ',
	    clientId: 'glvhg0hqhqqbdfuarvfsug4rt',
	    cognito_idp_endpoint: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_TNryPv9dQ',
	    cognito_identity_endpoint: '',
	    sts_endpoint: '',
	    url: 'https://proterra-exp-dev.auth.us-east-1.amazoncognito.com/authorize?',
	    // proterra_url: 'http://localhost:9000',
	    proterra_url: 'https://dev-mdc.proterra.com',
	    version: '2016-04-18',
	    tabs_url: "https://exp-api.proterra.com/exp-ams-dev/ams/v1/ui/tabs",
	    tanent_url: "https://exp-api.proterra.com/exp-ams-dev/v1/tenants",
	    corporate_token_url: 'https://proterra-exp-dev.auth.us-east-1.amazoncognito.com/oauth2/token',
	    corporate_logout_url: 'https://proterra-exp-dev.auth.us-east-1.amazoncognito.com/logout',

	}
};
