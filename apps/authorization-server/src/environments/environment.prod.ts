export const environment = {
  production: true,
  routes: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    CONFIRMATION: '/oauth2/confirmation',
    AUTHORIZE: '/oauth2/authorize',
    CHECK_USER: '/auth/verify_user',
    INFO: '/info',
    SIGNUP_VIA_EMAIL: '/signup/v1/email',
    VERIFY_SIGNUP_CODE: 'signup/v1/verify',
    CHECK_PASSWORD: '/auth/verify_password',
    LIST_SOCIAL_LOGINS: '/social_login/v1/list_logins',
  },
};
