export const environment = {
  production: true,
  routes: {
    LOGIN: '/auth/login',
    LOGIN_PASSWORDLESS: '/auth/password_less',
    SIGNUP: '/auth/signup',
    CONFIRMATION: '/oauth2/confirmation',
    AUTHORIZE: '/oauth2/authorize',
    CHECK_USER: '/auth/verify_user',
    INFO: '/info',
    SIGNUP_VIA_EMAIL: '/signup/v1/email',
    GENERATE_PASSWORD: '/user/v1/generate_password',
    CHECK_PASSWORD: '/auth/verify_password',
    LIST_SOCIAL_LOGINS: '/social_login/v1/list_logins',
    FORGOT_PASSWORD: '/user/v1/forgot_password',
    SEND_LOGIN_OTP: '/user/v1/send_login_otp',
  },
};