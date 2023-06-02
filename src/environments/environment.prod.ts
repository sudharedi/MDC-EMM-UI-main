export const environment = {
   production: true,
  API_URL: 'https://api.proterra.com/mdc-device/api/v1/mdcservice/core',

  cognitoLogin: {
  		base_url: "https://api.proterra.com/ams-prod2",
	    region: 'us-east-1',
	    identityPoolId: 'us-east-1:fe585e88-2ef9-40b2-a124-670eed18d6e0',
	    userPoolId: 'us-east-1_Cod1saW4z',
	    clientId: '2d59vn94qgaqun2krmkjd7rim5',
	    cognito_idp_endpoint: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Cod1saW4z',
	    cognito_identity_endpoint: '',
	    sts_endpoint: '',
	    url: 'https://ams.auth.us-east-1.amazoncognito.com/authorize?',
	    proterra_url: 'https://mdc.proterra.com',
	    version: '2016-04-18',
	    tabs_url: "https://api.proterra.com/ams-prod2/ams/v1/ui/tabs",
	    tanent_url: "https://api.proterra.com/ams-prod2/v1/tenants",
	    corporate_token_url: 'https://ams.auth.us-east-1.amazoncognito.com/oauth2/token',
	    corporate_logout_url: 'https://ams.auth.us-east-1.amazoncognito.com/logout'
	}
};

