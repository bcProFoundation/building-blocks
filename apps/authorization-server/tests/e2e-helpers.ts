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

export const OIDCKey = {
  keyPair: {
    kty: 'RSA',
    kid: 'ZoQ6MA0Bex8qEQ3v7OzUA7mTRhMb0kpZRmw6gNnArxc',
    e: 'AQAB',
    n:
      'kz7AAHs5ctl8uYX5MiH76OXCO9H1IP7D51gEx5CQ5f5gD5BJET6uWlOcUI6cTMLQoDn4l7vZ_IJDuVq3lG1n0JcqIUk3uOoKegiyMB4BqW9w3cxFV2KNJnDfgM89jhRXRICsJv6wsgzyMotLG0u9F4DhsbgZoxSn-tfyqIPJKTR1QH_hx6auRzIBu3qNjnlfoPgOl5GPyreqdg-J5oafiU7E0-go9ZbhbYyVtlhD8Fu4qmeb8qk2jnxfnHkj9PnB7AC5j4c6XUPcls36Ik1mhtXIfcBz4PFVrzOW16Ve8n9p1TEJx-C8rm1Q5PYLTFzzoMT0cVWLNJH7qOMgdE8Xxw',
    d:
      'MveshD4jE5MeriUmrei_hs1I32X8oLAu5Xw9I0ryLPpRC_IYqKR2u4NnfybuCVAB4QRP_U2j1djNUnKJSxJXtgctKRpr9FDm0XkDHM62Ko0Nl2ims-nEDANUCgUyPGTkFC0p6dGNHgSHLWGz3L3ptSICfX7JOP7kalqnfxcm4WDj7g9MI3wNAMh1qRSMybob_3BnncG9xIUJFfbgw0JKtEvoqynwoHjWth2a2hg_6Ebm_ydXpvs13iY8Y6gLDSzlSyZH7zSiY2CSa73xu5QxXlhczE22lvNTy6ZDTfzCFIvBtJt4GibaM_CR-nPZwGWIorTNlndmu59td-TKCldhCQ',
    p:
      '5DUJysHO8S3iHLLB_AzY6sq5YmYBus3_pm12MTF-5vkWU2Bgba1mU9Qs45mPzxxbxUl6Bj7wLKgP8KM5KB21CJOuMdZes3Hen9SgdJdtSJNNNL5yyHCh0lgYGqMy-V3wyqre0Fujt4pZmVl4COD7uBg-Dk_p9yYs2lUBkM7gtbs',
    q:
      'pS2BavaJw-IOOOjINfthtwdI6zUImRhEh5UtMbos7Y_0Oc3e94cks6n1jKwXCKILFf0y41m0OMBV5w71FqyT81xSc0ISmtlCzD5dcZLMYVEOJQi03F_NNUhBcspVWTVhoCpjDbKflEVTPbkhcpnKsL9vTHiYzmwDdSM9aQ-1X2U',
    dp:
      'f-iOdXvNvvalvsoe2mRlDKzV3aYpIAgoW6MM1SPV6iYA8niZc7_2E9Rf2K4QodhWQ60cXPXX7l_Al3MVLTwBZS5JO5vY9qFDU7h8uvzI_x2473Azq88dlGVWFVAV2RljRmUhgA1tJQnBkKdKFUftLtE_rwvxqlpWV4W_2-doodM',
    dq:
      'cKVF-0JC1ZmWhW0LDPVwwDdxnSY_xNht8-DiP2VuOlzP-5PQmRJLD1O7J8I8uyB3Wvmf-Lg2VfWlH7xtnJb5FyBBAmVu9rdv_IYTh97LDxsOAGedoCSdd9bc-4HNDtd-ypHdl3vXpHBawl881kDXoA4NwyMDYtL60KnFuZ6C3Jk',
    qi:
      'EUrS_kW5fAzZRVYQKoqUaXAa43Oa7lINkRdR7QBfvAMhzBMQVw4L-M-oqwPRyNcXJzOcHFH5XHukTvAwSHWXfa0zng2nQDkszF5nqDQmBPYQ7_YfU1GAw0aElMxlnHak9qKLpg_HrlHMD8SYOPOh-MOT3dkpDv4qRjdIjWes6J4',
  },
};
