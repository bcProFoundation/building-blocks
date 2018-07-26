// Create client DTO
export const CLIENT_NAME_DESCRIPTION = 'e.g MyAwesomeApp';
export const CLIENT_SECRET_DESCRIPTION = 'The OAuth2.0 Client\'s secret Key';
export const CLIENT_IS_TRUSTED = 'Skips the Allow/Deny screen if value is 1.';
export const CLIENT_REDIRECT_URI =
  'The endpoint which will receive the token/code from IDP.';

// Create user DTO
export const USERDTO_EMAIL_DESCRIPTION = 'Identifies a user uniquely.';
export const USERDTO_EMAIL_EXAMPLE = 'luke.skywalker@twosuns.com';
export const USERDTO_PASSWORD_DESCRIPTION =
  'Strong alphanumeric password, enriched with special characters.';
export const USERDTO_PASSWORD_EXAMPLE = 'h4cv_4%b2#D:-)';
export const USERDTO_REDIRECT_DESCRIPTION =
  'URL to which the user will be redirected after login';
export const USERDTO_NAME_DESCRIPTION = 'Full name of the user';

// App Controller
export const APP_LOGOUT_TITLE = 'Logout';
export const APP_LOGOUT_DESCRIPTION = 'Logout of the session.';
export const APP_ACCOUNT_TITLE = 'Account';
export const APP_ACCOUNT_DESCRIPTION = 'View the logged in User\'s account.';

// Auth Controller
export const AUTH_LOGIN_TITLE = 'Login';
export const AUTH_LOGIN_DESCRIPTION = 'Log in with username and password.';
export const AUTH_SIGNUP_TITLE = 'Signup';
export const AUTH_SIGNUP_DESCRIPTION = 'Add a new user.';

// OAuth2 Controller
export const OAUTH2_AUTHORIZE_TITLE = 'Authorize';
export const OAUTH2_AUTHORIZE_DESCRIPTION =
  'OAuth2.0 flow: Returns an authorization code to the redirect uri specified in the parameters.';
export const OAUTH2_TOKEN_TITLE = 'Token';
export const OAUTH2_TOKEN_DESCRIPTION = 'OAuth2.0 flow: Return a token';
export const OAUTH2_PROFILE_TITLE = 'Profile';
export const OAUTH2_PROFILE_DESCRIPTION =
  'Used in putting together SSO for resource servers.';
export const OAUTH2_REVOKE_TITLE = 'Revoke';
export const OAUTH2_REVOKE_DESCRIPTION =
  'OAuth2.0 flow: Revoke a token explicitly';
export const OAUTH2_TOKEN_INTROSPECTION_TITLE = 'Introspection';
export const OAUTH2_TOKEN_INTROSPECTION_DESCRIPTION =
  'Validate a token from the IDP from a resource server';
