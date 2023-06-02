export const environment = {
   production: true,
  API_URL: 'https://api.proterra.com/mdc-device-stage/api/v1/mdcservice/core',

  cognitoLogin: {
  		base_url: "https://api.proterra.com/ams-test",
	    region: 'us-east-1',
	    identityPoolId: 'us-east-1:2addd8ba-ca4e-4225-9116-b32d5a13de8a',
	    userPoolId: 'us-east-1_fF4Lu1TpB',
	    clientId: '7pua957668ig1o002aqed87ucb',
	    cognito_idp_endpoint: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_fF4Lu1TpB',
	    cognito_identity_endpoint: '',
	    sts_endpoint: '',
	    url: 'https://proterra-staging.auth.us-east-1.amazoncognito.com/authorize?',
	    proterra_url: 'https://stage-mdc.proterra.com',
	    version: '2016-04-18',
	    tabs_url: "https://api.proterra.com/ams-test/ams/v1/ui/tabs",
	    tanent_url: "https://api.proterra.com/ams-test/v1/tenants",
	    corporate_token_url: 'https://proterra-staging.auth.us-east-1.amazoncognito.com/oauth2/token',
	    corporate_logout_url: 'https://proterra-staging.auth.us-east-1.amazoncognito.com/logout'
	}
};

