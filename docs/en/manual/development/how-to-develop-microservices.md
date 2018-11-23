### Setup Infrastructure

Setup the apps from building blocks infrastructure as per need.

### Add Client on authorization-server

Using the UI from infrastructure-console add Client on authorization-server and obtain clientId, clientSecret.

Set important fields as per need, redirect uris have to be set as per the client. app.

### Prepare Resource Server (Your microservice)

- Store clientId, clientSecret, authorizationServerUrl in your microservice. It can be used to connect to authorization-server using openid connect. Use authorization server's `/.well-known/openid-configuration` and `/.well-known/jwks`
- Use `angular-oauth2-oidc` or openid-connect client libraries to prepare client applications to make requests.
- For protecting server side endpoints intercept header (`Authorizaion: Bearer tokenHash`) or query (`/?access_token=tokenHash`) of the incoming request.
- Introspect the token using the authorization-server's `/oauth2/introspection` endpoint
- Response of token introspection endpoint can be cached for re-use. Clean the cache on expiry or periodically.
- No need to store users in microservice.
- If `roles` is passed as scope for generating token, the id_token claims will have user's roles and can be used to guard endpoints based on roles.
- More granular control over resource access and sharing can be designed in resource server's (your microservice) logic.
