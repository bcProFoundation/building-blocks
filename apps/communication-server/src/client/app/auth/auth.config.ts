import { AuthConfig } from 'angular-oauth2-oidc';

export function authConfig(clientId?) {
  const out: AuthConfig = {
    // Url of the Identity Provider
    issuer: 'http://database.dev:3000/oauth2/confirmation',

    // URL of the SPA to redirect the user to after login
    redirectUri: window.location.origin + '/auth/callback',

    // The SPA's id. The SPA is registerd with this id at the auth-server
    clientId: clientId || 'spa-demo',

    // set the scope for the permissions the client should request
    // The first three are defined by OIDC. The 4th is a usecase-specific one
    scope: 'openid email roles',
  };
  return out;
}
