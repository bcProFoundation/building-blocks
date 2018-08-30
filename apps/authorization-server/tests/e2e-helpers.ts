export function getParameterByName(url, name) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&#]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function extractToken(hash) {
  var match = hash.match(/access_token=(\w+)/);
  return !!match && match[1];
}

export function introspectToken(request, accessToken, clientAccessToken) {
  request
    .post('/oauth2/introspection')
    .send({
      token: accessToken,
    })
    .set('Authorization', 'Bearer ' + clientAccessToken)
    .expect(200);
}
